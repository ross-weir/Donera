import { Donera, DoneraInstance, DoneraTypes } from "@donera/dapp/contracts";
import { BaseIndexer, IndexerConfig } from "./indexer";
import { EventSubscription, Subscription } from "@alephium/web3";

export type EventIndexerConfig = {
  intervalMs: number;
  donera: DoneraInstance;
};

type DoneraEvent =
  | DoneraTypes.FundListedEvent
  | DoneraTypes.DonationEvent
  | DoneraTypes.FundFinalizedEvent;

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
  private subscription?: EventSubscription;
  private readonly intervalMs: number;
  private readonly donera: DoneraInstance;

  constructor(cfg: IndexerConfig, { donera, intervalMs }: EventIndexerConfig) {
    super(cfg);
    this.donera = donera;
    this.intervalMs = intervalMs;
  }

  async start(): Promise<void> {
    this.currentHeight = await this.getCurrentHeight();
    this.subscription = this.donera.subscribeAllEvents(
      {
        pollingInterval: this.intervalMs,
        errorCallback: (e, s) => this.onError(e, s),
        // events should be passed seqentially at time of writting
        // we write to the database on every event, an optimization could
        // be batching the events and using a db txn, there doesn't currently
        // seem to be a good way to do this with how subscription
        // callbacks are structured
        messageCallback: (e) => this.onEvent(e),
      },
      this.currentHeight
    );
  }

  async stop(): Promise<void> {
    this.subscription?.unsubscribe();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async onError(e: any, subscription: Subscription<DoneraEvent>): Promise<void> {
    // handle db transaction errors
    console.error(e);
    // only unsubscribe if fatal error
    subscription.unsubscribe();
    return;
  }

  private async onEvent(event: DoneraEvent): Promise<void> {
    switch (event.eventIndex) {
      case Donera.eventIndex.FundListed:
        return this.processFundListed(event as DoneraTypes.FundListedEvent);
      case Donera.eventIndex.Donation:
        return this.processDonation(event as DoneraTypes.DonationEvent);
      case Donera.eventIndex.FundFinalized:
        return this.processFundFinalized(event as DoneraTypes.FundFinalizedEvent);
      default:
        return;
    }
  }

  private async processFundListed(event: DoneraTypes.FundListedEvent): Promise<void> {
    const { fundContractId, goal, recipient, ...rest } = event.fields;

    this.db.$transaction([
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
          goal: goal.toString(),
          beneficiary: recipient,
          organizer: "",
          verified: true,
          // convert to unixts
          deadline: new Date(),
          txId: event.txId,
          ...rest,
        },
      }),
      this.incrementHeight(),
    ]);

    // if the fund exists then update to verified: db.fund.upsert
    // otherwise create fund with verified set to true
    console.log(event);
    return;
  }

  private async processDonation(event: DoneraTypes.DonationEvent): Promise<void> {
    console.log(event);
    return;
  }

  private async processFundFinalized(event: DoneraTypes.FundFinalizedEvent): Promise<void> {
    console.log(event);
    return;
  }
}
