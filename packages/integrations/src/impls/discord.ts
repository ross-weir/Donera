import pino from "pino";
import { DiscordIntegrationConfig } from "../config";
import { Integration } from "../integration";
import { DoneraTypes } from "@donera/dapp/contracts";
import { Lifecycle } from "@donera/core";

// VERY ROUGH WIP
// just a proof of concept right now and testing
export class DiscordIntegration implements Integration, Lifecycle {
  private readonly cfg: DiscordIntegrationConfig;
  private readonly logger: pino.Logger;

  constructor(cfg: DiscordIntegrationConfig, logger: pino.Logger) {
    this.cfg = cfg;
    this.logger = logger;
  }
  async start(): Promise<void> {}

  async stop(): Promise<void> {}

  async onFundListed(e: DoneraTypes.FundListedEvent): Promise<void> {
    this.logger.debug(e);
    const { name, organizer, beneficiary, goal, deadlineTimestamp } = e.fields;
    const embeds = [
      {
        title: "New fundraiser!",
        description: `Fundraiser '${name}' was just started by ${organizer} for ${beneficiary}... They are hoping to raise ${goal} ALPH by ${new Date(
          Number(deadlineTimestamp) * 1000
        )}`,
      },
    ];
    await this.postWebhook(embeds);
  }

  async onDonation(e: DoneraTypes.DonationEvent): Promise<void> {
    this.logger.debug(e);
    const embeds = [
      {
        title: "New donation!",
        description: `${e.fields.donor} donated ${e.fields.amount} ${e.fields.tokenId}`,
      },
    ];
    await this.postWebhook(embeds);
  }

  async onFundFinalization(e: DoneraTypes.FundFinalizedEvent): Promise<void> {
    this.logger.debug(e);
  }

  private async postWebhook(embeds: Array<Record<string, string>>): Promise<void> {
    // only posting to one
    const response = await fetch(this.cfg.webhooks[0], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "Donera dApp", embeds }),
    });
    this.logger.info(await response.json());
  }
}
