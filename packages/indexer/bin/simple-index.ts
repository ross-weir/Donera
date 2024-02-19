import { SimpleEventIndexer } from "../src";
import { loadDeployments } from "@donera/dapp/deploys";
import alephiumConfig from "@donera/alephium-config/default";
import { NetworkId, web3 } from "@alephium/web3";
import db from "@donera/database";

const networkId: NetworkId = "devnet";

// TODO, get network form somewhere
const { nodeUrl } = alephiumConfig.networks[networkId];
// Bun has issues with localhost urls: https://github.com/oven-sh/bun/issues/1425
const bunFix = nodeUrl.replace("localhost", "127.0.0.1");

web3.setCurrentNodeProvider(bunFix);
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
