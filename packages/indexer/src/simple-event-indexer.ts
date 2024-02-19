import { Donera, DoneraTypes } from "@donera/dapp/contracts";
import { BaseIndexer, IndexerConfig } from "./indexer";
import { Contract, hexToString, node } from "@alephium/web3";
import { PrismaPromise } from "@donera/database";
import { Deployments } from "@donera/dapp/deploys";

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
    const { events, nextStart } = await this.node.events.getEventsContractContractaddress(
      this.deploys.contracts.Donera.contractInstance.address,
      {
        start: this.currentHeight,
      }
    );

    if (nextStart === this.currentHeight) {
      return;
    }

    // we need to handle events seqentially due to how we update balances currently
    // if we get balances form node
    for (const event of events) {
      const txns = await this.onEvent(event);
      await this.db.$transaction([...txns.flat(), this.incHeight()]);
      this.currentHeight++;
    }
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
          ...data,
        },
      }),
    ];
  }

  // when updating balances it might be better to just get the balances from
  // the node instead of calculating it ourselves. Although would need to
  // test, not sure what ordering is done. For example if we get a donation event
  // would the contract balance already be updated?
  //
  // https://github.com/ross-weir/Donera/issues/31
  private async processDonation(event: DoneraTypes.DonationEvent): Promise<Tx[]> {
    const { fundContractId, amount, tokenId, ...rest } = event.fields;
    // we need to do this because the balances are stored as strings
    // can't do it on the db level
    const existingBalance = await this.db.balance.findFirst({
      where: {
        tokenId,
        fundId: fundContractId,
      },
    });
    let newBalance = amount;
    if (existingBalance) {
      newBalance += BigInt(existingBalance.balance);
    }
    return [
      this.db.donation.create({
        data: {
          amount: amount.toString(),
          fundId: fundContractId,
          tokenId,
          ...rest,
        },
      }),
      this.db.balance.upsert({
        where: {
          tokenId_fundId: {
            tokenId,
            fundId: fundContractId,
          },
        },
        update: {
          balance: {
            set: newBalance.toString(),
          },
        },
        create: {
          tokenId,
          fundId: fundContractId,
          balance: newBalance.toString(),
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
