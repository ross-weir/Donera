import { DoneraConfig } from "@donera/cli";

const webhook = process.env.DONERA_DISCORD_WEBHOOK!;

const config: DoneraConfig = {
  networkId: "devnet",
  integrations: {
    services: {
      discord: {
        webhooks: [webhook],
      },
    },
    filters: {
      // if a preddicate returns `true` the event will be filtered out and not passed to the services
      donation: [],
      finalization: [],
    },
  },
};

export default config;
