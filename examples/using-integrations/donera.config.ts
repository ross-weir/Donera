import { DoneraConfig } from "@donera/cli";

const onlyMyFund = async ({ fundContractId }: { fundContractId: string }) =>
  fundContractId !== process.env.MY_FUND_ID;

const config: DoneraConfig = {
  networkId: "devnet",
  integrations: {
    services: {
      discord: {},
    },
    filters: {
      // if a preddicate returns `true` the event will be filtered out and not passed to the services
      donation: [onlyMyFund],
      finalization: [onlyMyFund],
    },
  },
};

export default config;
