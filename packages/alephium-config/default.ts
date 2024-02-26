import { Configuration } from "@alephium/cli";

const privateKeys = () => {
  const pks = process.env.DONERA_PRIVATE_KEYS;
  if (!pks) {
    return [];
  }
  return pks.split(",");
};

const defaultSettings = {};

const config: Configuration<unknown> = {
  networks: {
    devnet: {
      nodeUrl: "http://127.0.0.1:22973",
      privateKeys: ["7f5692ab35cdf90f25a01c128fdce1fbea202dddd15eccb635b127bb6368db46"],
      settings: defaultSettings,
    },
    testnet: {
      nodeUrl: process.env.DONERA_NODE_URL ?? "https://wallet-v20.testnet.alephium.org",
      privateKeys: privateKeys(),
      settings: defaultSettings,
    },
    mainnet: {
      nodeUrl: process.env.DONERA_NODE_URL ?? "https://wallet-v20.mainnet.alephium.org",
      privateKeys: privateKeys(),
      settings: defaultSettings,
    },
  },
};

export default config;
