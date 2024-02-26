import { Donera, DoneraTypes } from "@donera/dapp/contracts";
import { BaseIndexer, IndexerConfig } from "./indexer";
import { ALPH_TOKEN_ID, Contract, addressFromContractId, hexToString, node } from "@alephium/web3";
import { Prisma, PrismaPromise } from "@donera/database";
import { Deployments } from "@donera/dapp/deploys";
import { nanoid } from "nanoid";

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
    this.taskHandle = setInterval(async () => await this.processEvents(), this.intervalMs);
  }

  async stop(): Promise<void> {
    clearInterval(this.taskHandle);
  }

  private async processEvents(): Promise<void> {
    const { groupIndex, address } = this.deploys.contracts.Donera.contractInstance;
    // const group = this.deploys.contracts.Donera.contractInstance.groupIndex;
    // const { events, nextStart } = await this.node.events.getEventsContractContractaddress(
    //   this.deploys.contracts.Donera.contractInstance.address,
    //   {
    //     // group,
    //     start: this.currentHeight,
    //   }
    // );
    const { events, nextStart } = (await this.getEventsHacky(
      address,
      this.currentHeight,
      groupIndex
    )) as any;

    if (nextStart === this.currentHeight) {
      return;
    }

    const createEvents = events.filter((e) => e.eventIndex === Donera.eventIndex.FundListed);
    const otherEvents = events.filter((e) => e.eventIndex !== Donera.eventIndex.FundListed);
    const createTxns = await Promise.all(createEvents.map((e) => this.onEvent(e)));
    const otherTxns = await Promise.all(otherEvents.map((e) => this.onEvent(e)));

    for (const tx of createTxns.flat()) {
      await tx;
      await this.incHeight();
      this.currentHeight++;
    }

    for (const tx of otherTxns.flat()) {
      await tx;
      await this.incHeight();
      this.currentHeight++;
    }

    // await this.db.$transaction(
    //   [...createTxns.flat(), ...otherTxns.flat(), this.updateHeight(nextStart)],
    //   {
    //     isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    //   }
    // );
    // this.currentHeight = nextStart;
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
    const { name, description, fundContractId, goal, deadlineTimestamp, ...rest } = event.fields;
    const data = {
      name: hexToString(name),
      description: hexToString(description),
      goal: goal.toString(),
      verified: true,
      deadline: new Date(Number(deadlineTimestamp * 1000n)),
      txId: event.txId,
      ...rest,
    };
    return [
      this.db.fund.upsert({
        where: {
          id: fundContractId,
        },
        // The previous values where provided by the client
        // update them to ensure the client provided the right fields
        update: {
          ...data,
        },
        create: {
          id: fundContractId,
          shortId: nanoid(10),
          metadata: {},
          ...data,
        },
      }),
    ];
  }

  private async processDonation(event: DoneraTypes.DonationEvent): Promise<Tx[]> {
    const { fundContractId, amount, tokenId, ...rest } = event.fields;
    // const { asset } = await this.deploys.contracts.Donera.contractInstance.fetchState();

    const contractAddress = addressFromContractId(fundContractId);
    // const { asset } = await this.node.contracts.getContractsAddressState(contractAddress);
    const { asset } = (await this.getStateHacky(contractAddress)) as any;
    const balances = [
      { id: ALPH_TOKEN_ID, amount: asset.attoAlphAmount.toString() },
      ...(asset.tokens ?? []),
    ];

    // const tokenBalances = (asset.tokens ?? []).map((t) => ({
    //   id: t.id,
    //   amount: t.amount.toString(),
    // }));
    // balances = []
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

  private async getEventsHacky(
    contractAddress: string,
    start: number,
    group: number
  ): Promise<unknown> {
    const response = await fetch(
      `https://wallet-v20.testnet.alephium.org/events/contract/${contractAddress}?start=${start}&group=${group}`,
      {
        headers: {
          accept: "application/json",
          "accept-language": "en-GB,en;q=0.8",
          "sec-ch-ua": '"Not A(Brand";v="99", "Brave";v="121", "Chromium";v="121"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
        },
        referrer: "https://wallet-v20.testnet.alephium.org/docs/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "omit",
      }
    );
    return response.json();
  }
  private async getStateHacky(address: string): Promise<unknown> {
    const result = await fetch(
      `https://wallet-v20.testnet.alephium.org/contracts/${address}/state?group=0`,
      {
        headers: {
          accept: "application/json",
          "accept-language": "en-GB,en;q=0.8",
          "sec-ch-ua": '"Not A(Brand";v="99", "Brave";v="121", "Chromium";v="121"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
        },
        referrer: "https://wallet-v20.testnet.alephium.org/docs/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "omit",
      }
    );
    return result.json();
  }
}
