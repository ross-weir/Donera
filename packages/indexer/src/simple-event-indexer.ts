import { Donera, DoneraTypes } from "@donera/dapp/contracts";
import { BaseIndexer, IndexerConfig } from "./indexer";
import { ALPH_TOKEN_ID, Contract, addressFromContractId, hexToString, node } from "@alephium/web3";
import { PrismaPromise } from "@donera/database";
import { Deployments } from "@donera/dapp/deploys";
import { nanoid } from "nanoid";
import { OffchainMetadata } from "@donera/dapp";

export type EventIndexerConfig = {
  intervalMs: number;
  deploys: Deployments;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Tx = PrismaPromise<any>;

// TODO: handle chain re-orgs?

/**
 * Simple in-memory indexer that uses events emitted
 * by the Donera contract to build the state of the
 * protocol.
 *
 * This should be enough for our use case. If Donera
 * gets popular one day we might need to make
 * a more scalable solution.
 */
export class SimpleEventIndexer extends BaseIndexer {
  private readonly intervalMs: number;
  private readonly deploys: Deployments;
  private taskHandle?: Timer;

  constructor(cfg: IndexerConfig, { deploys, intervalMs }: EventIndexerConfig) {
    super(cfg);
    this.deploys = deploys;
    this.intervalMs = intervalMs;
  }

  async run(): Promise<void> {
    console.log(`Monitoring donera ${this.deploys.contracts.Donera.contractInstance.address}`);
    this.taskHandle = setInterval(async () => await this.processEvents(), this.intervalMs);
  }

  async stop(): Promise<void> {
    clearInterval(this.taskHandle);
  }

  private async processEvents(): Promise<void> {
    const { events, nextStart } = await this.node.events.getEventsContractContractaddress(
      this.deploys.contracts.Donera.contractInstance.address,
      {
        start: this.currentHeight,
      }
    );

    if (nextStart === this.currentHeight) {
      return;
    }

    const createEvents = events.filter((e) => e.eventIndex === Donera.eventIndex.FundListed);
    const otherEvents = events.filter((e) => e.eventIndex !== Donera.eventIndex.FundListed);
    const createTxns = await Promise.all(createEvents.map((e) => this.onEvent(e)));
    const otherTxns = await Promise.all(otherEvents.map((e) => this.onEvent(e)));

    await this.db.$transaction([
      ...createTxns.flat(),
      ...otherTxns.flat(),
      this.updateHeight(nextStart),
    ]);
    this.currentHeight = nextStart;
  }

  private onEvent(contractEvent: node.ContractEvent): Promise<Tx[]> {
    const event = Contract.fromApiEvent(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contractEvent as any,
      undefined,
      contractEvent.txId,
      () => Donera.contract
    );
    console.log("handling event", event);
    switch (event.eventIndex) {
      case Donera.eventIndex.FundListed:
        return this.processFundListed(event as DoneraTypes.FundListedEvent);
      case Donera.eventIndex.Donation:
        return this.processDonation(event as DoneraTypes.DonationEvent);
      case Donera.eventIndex.FundFinalized:
        return this.processFundFinalized(event as DoneraTypes.FundFinalizedEvent);
      default:
        throw new Error(`Unsupported event index: ${event.eventIndex}`);
    }
  }

  private async processFundListed(event: DoneraTypes.FundListedEvent): Promise<Tx[]> {
    const {
      metadataUrl: metadataUrlHex,
      fundContractId,
      goal,
      deadlineTimestamp,
      ...rest
    } = event.fields;
    const metadataUrl = hexToString(metadataUrlHex);
    const metadataCid = metadataUrl.split("//")[1];
    const response = await fetch(`${this.ipfsGateway}/${metadataCid}`);
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`IPFS metadata request failed, status: ${response.status}, body: ${body}`);
    }
    const { name, description, imageUrl } = (await response.json()) as OffchainMetadata;
    const data = {
      name,
      description,
      goal: goal.toString(),
      verified: true,
      deadline: new Date(Number(deadlineTimestamp * 1000n)),
      metadataUrl,
      txId: event.txId,
      ...rest,
    };
    return [
      this.db.fund.upsert({
        where: {
          id: fundContractId,
        },
        update: {
          metadata: {
            image: {
              url: imageUrl,
            },
          },
          ...data,
        },
        create: {
          id: fundContractId,
          shortId: nanoid(10),
          metadata: {
            image: {
              url: imageUrl,
            },
          },
          ...data,
        },
      }),
    ];
  }

  private async processDonation(event: DoneraTypes.DonationEvent): Promise<Tx[]> {
    const { fundContractId, amount, tokenId, ...rest } = event.fields;
    const contractAddress = addressFromContractId(fundContractId);
    const { asset } = await this.node.contracts.getContractsAddressState(contractAddress);
    const balances = [{ id: ALPH_TOKEN_ID, amount: asset.attoAlphAmount }, ...(asset.tokens ?? [])];
    return [
      this.db.donation.create({
        data: {
          amount: amount.toString(),
          fundId: fundContractId,
          tokenId,
          ...rest,
        },
      }),
      this.db.fund.update({
        where: {
          id: fundContractId,
        },
        data: {
          balances: {
            set: balances,
          },
        },
      }),
    ];
  }

  private async processFundFinalized(event: DoneraTypes.FundFinalizedEvent): Promise<Tx[]> {
    const { fundContractId, finalizer } = event.fields;
    return [
      this.db.fund.update({
        where: {
          id: fundContractId,
        },
        data: {
          finalizedBy: finalizer,
          finalized: true,
        },
      }),
    ];
  }
}
