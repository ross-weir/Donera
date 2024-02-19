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

    await this.db.$transaction([
      ...events.map((e) => this.onEvent(e)).flat(),
      this.updateHeight(nextStart),
    ]);
    this.currentHeight = nextStart;
  }

  private onEvent(contractEvent: node.ContractEvent): Tx[] {
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

  private processFundListed(event: DoneraTypes.FundListedEvent): Tx[] {
    const { name, description, fundContractId, goal, deadlineTimestamp, ...rest } = event.fields;

    return [
      this.db.fund.upsert({
        where: {
          id: fundContractId,
        },
        // update all the fields from the event, its the source of truth
        update: {
          verified: true,
        },
        create: {
          id: fundContractId,
          name: hexToString(name),
          description: hexToString(description),
          goal: goal.toString(),
          verified: true,
          // maybe store as unix ts instead
          deadline: new Date(Number(deadlineTimestamp * 1000n)),
          txId: event.txId,
          ...rest,
        },
      }),
    ];
  }

  private processDonation(event: DoneraTypes.DonationEvent): Tx[] {
    console.log(event);
    return [];
  }

  private processFundFinalized(event: DoneraTypes.FundFinalizedEvent): Tx[] {
    console.log(event);
    return [];
  }
}
