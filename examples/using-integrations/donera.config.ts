import { DoneraConfig } from "@donera/cli";

const config: DoneraConfig = {
  networkId: "devnet",
  integrations: {
    services: {
      discord: {
        // webhooks, from env vars
      },
    },
    filters: {},
  },
};

export default config;
