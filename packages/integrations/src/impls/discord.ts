import pino from "pino";
import { DiscordIntegrationConfig } from "../config";
import { Integration } from "../integration";
import { DoneraTypes } from "@donera/dapp/contracts";
import { Lifecycle } from "@donera/core";

export class DiscordIntegration implements Integration, Lifecycle {
  private readonly cfg: DiscordIntegrationConfig;
  private readonly logger: pino.Logger;

  constructor(cfg: DiscordIntegrationConfig, logger: pino.Logger) {
    this.cfg = cfg;
    this.logger = logger;
    this.logger.info(`started with config ${this.cfg}`);
  }
  async start(): Promise<void> {
    // ensure discord env var secret exists
  }

  async stop(): Promise<void> {}

  async onFundListed(e: DoneraTypes.FundListedEvent): Promise<void> {
    this.logger.info(e);
  }

  async onDonation(e: DoneraTypes.DonationEvent): Promise<void> {
    this.logger.info(e);
  }

  async onFundFinalization(e: DoneraTypes.FundFinalizedEvent): Promise<void> {
    this.logger.info(e);
  }
}
