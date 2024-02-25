import { Donera, DoneraInstance, DoneraTypes } from "@donera/dapp/contracts";
import { DiscordIntegrationConfig, DoneraIntegrationConfig } from "./config";
import pino from "pino";
import { Integration } from "./integration";
import { DiscordIntegration } from "./impls/discord";
import { EventSubscription, Subscription } from "@alephium/web3";
import { Lifecycle } from "@donera/core";

type DoneraEvent =
  | DoneraTypes.FundListedEvent
  | DoneraTypes.DonationEvent
  | DoneraTypes.FundFinalizedEvent;

// TODO: this could be made typesafe, currently just check at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const integrationFactoryMap: any = {
  discord: (cfg: DiscordIntegrationConfig, logger: pino.Logger) =>
    new DiscordIntegration(cfg, logger),
};

//TODO
// one integration throwing a error causes the whole integration to crash
// error handling needs to be improved a lot here
export class DoneraIntegration implements Lifecycle {
  private readonly cfg: DoneraIntegrationConfig;
  private readonly logger: pino.Logger;
  private readonly donera: DoneraInstance;
  private readonly integrations: Integration[] = [];
  private subscription?: EventSubscription;

  // accept a pino logger then create children for each integration
  constructor(cfg: DoneraIntegrationConfig, logger: pino.Logger, donera: DoneraInstance) {
    this.cfg = cfg;
    this.logger = logger;
    this.donera = donera;
  }

  async start(): Promise<void> {
    const { services } = this.cfg;
    if (!services) {
      throw new Error("no integrations supplied");
    }

    this.logger.debug("initializing integrations");

    for (const [service, cfg] of Object.entries(services)) {
      const factory = integrationFactoryMap[service];

      if (!factory) {
        this.logger.warn(`No integration factory found for ${service}`);
      }

      const logger = this.logger.child({ service });
      this.integrations.push(factory(cfg, logger));
    }

    if (!this.integrations) {
      throw new Error("no integrations initialzed");
    }

    this.subscription = this.donera.subscribeAllEvents({
      pollingInterval: 5000,
      errorCallback: (e, s) => this.onError(e, s),
      messageCallback: (e) => this.onEvent(e),
    });
  }

  async stop(): Promise<void> {
    this.subscription?.unsubscribe();
  }

  private async onError(error: unknown, subscription: Subscription<DoneraEvent>): Promise<void> {
    this.logger.error(error);
    subscription.unsubscribe();
    // bubble up to cli
    throw error;
  }

  private async onEvent(event: DoneraEvent): Promise<void> {
    const promises = [];
    switch (event.eventIndex) {
      case Donera.eventIndex.FundListed:
        promises.push(
          ...this.integrations.map((i) => i.onFundListed(event as DoneraTypes.FundListedEvent))
        );
        break;
      case Donera.eventIndex.Donation:
        promises.push(
          ...this.integrations.map((i) => i.onDonation(event as DoneraTypes.DonationEvent))
        );
        break;
      case Donera.eventIndex.FundFinalized:
        promises.push(
          ...this.integrations.map((i) =>
            i.onFundFinalization(event as DoneraTypes.FundFinalizedEvent)
          )
        );
        break;
      default:
        return;
    }
    await Promise.all(promises);
  }
}
