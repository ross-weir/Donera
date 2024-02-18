// init any global configs

import alephiumConfigs from "@donera/alephium-config/default";
import { getNetwork } from "../donera";
import { web3 } from "@alephium/web3";

const { nodeUrl } = alephiumConfigs.networks[getNetwork()];

// set node provider if none set
try {
  web3.getCurrentNodeProvider();
} catch {
  web3.setCurrentNodeProvider(nodeUrl);
}
