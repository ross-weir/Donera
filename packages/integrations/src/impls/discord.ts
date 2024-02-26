import pino from "pino";
import { DiscordIntegrationConfig } from "../config";
import { Integration } from "../integration";
import { DoneraTypes } from "@donera/dapp/contracts";
import { Lifecycle } from "@donera/core";
import { ALPH_TOKEN_ID, hexToString, prettifyAttoAlphAmount } from "@alephium/web3";

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
    const { organizer, beneficiary, goal, deadlineTimestamp } = e.fields;
    const name = hexToString(e.fields.name);
    const description = hexToString(e.fields.description);
    const deadline = new Date(Number(deadlineTimestamp) * 1000);
    const fields = [
      {
        name: "**Name**",
        value: name,
      },
      { name: "**Description**", value: this.trucateString(description, 50) },
      {
        name: "**Goal**",
        value: `${prettifyAttoAlphAmount(goal)} ALPH`,
        inline: true,
      },
      {
        name: "**Deadline**",
        value: deadline.toISOString(),
        inline: true,
      },
      {
        name: "**Organizer**",
        value: this.code(organizer),
      },
      {
        name: "**Beneficiary**",
        value: this.code(beneficiary),
      },
    ];
    // title
    const embeds = [
      {
        title: "New fundraiser listed!",
        url: "https://example.com", // TODO
        color: 4649918,
        description: "A new fundraiser was just listed on Donera",
        fields,
      },
    ];
    await this.postWebhook(embeds);
  }

  async onDonation(e: DoneraTypes.DonationEvent): Promise<void> {
    const { donor, amount, tokenId } = e.fields;
    const data = {
      title: "Donation received!",
      url: "https://example.com",
      description: "A donation was just made to an active fundraiser campaign",
      color: 4649918,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fields: [] as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    // todo, get network & add alph to tokenlist
    const token = {
      id: "".padStart(64, "0"),
      name: "Alephium",
      symbol: "ALPH",
      decimals: 18,
      logoURI:
        "https://raw.githubusercontent.com/alephium/alephium-brand-guide/master/logos/grey/Logo-Icon-Grey.png",
    };
    const fields = [
      {
        name: "**Donor**",
        value: this.code(donor),
      },
      {
        name: "**Token**",
        value: token?.symbol ?? "*Unverified token*",
        inline: true,
      },
      {
        name: "**Amount**",
        value: prettifyAttoAlphAmount(amount),
        inline: true,
      },
    ];
    if (tokenId === ALPH_TOKEN_ID) {
      data.image = {
        url: "https://raw.githubusercontent.com/alephium/alephium-brand-guide/master/logos/grey/Logo-Icon-Grey.png",
      };
    } else if (token?.logoURI) {
      data.image = {
        url: token.logoURI,
      };
    }
    data.fields.push(...fields);
    await this.postWebhook([data]);
  }

  async onFundFinalization(e: DoneraTypes.FundFinalizedEvent): Promise<void> {
    this.logger.debug(e);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async postWebhook(embeds: Array<Record<string, any>>): Promise<void> {
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

  private trucateString(string: string, len: number): string {
    return string.length > len ? string.substring(0, len - 3) + "..." : string;
  }

  private code(string: string): string {
    return "`" + string + "`";
  }
}
