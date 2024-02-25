import { SimpleEventIndexer } from "../src";
import { loadDeployments } from "@donera/dapp/deploys";
import alephiumConfig from "@donera/alephium-config/default";
import { NetworkId, web3 } from "@alephium/web3";
import db from "@donera/database";

const networkId = process.env.DONERA_NETWORK_ID! as NetworkId;

// TODO, get network form somewhere
const { nodeUrl } = alephiumConfig.networks[networkId];

web3.setCurrentNodeProvider(nodeUrl);
const deploys = loadDeployments(networkId);

const indexerCfg = {
  node: web3.getCurrentNodeProvider(),
  db,
};

const indexer = new SimpleEventIndexer(indexerCfg, {
  intervalMs: 4000,
  deploys,
});

console.log("starting SIMPLE indexing..");

await indexer.start();
