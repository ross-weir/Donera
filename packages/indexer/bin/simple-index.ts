import { SimpleEventIndexer } from "../src";
import { loadDeployments } from "@donera/dapp/deploys";
import alephiumConfig from "@donera/alephium-config/default";
import { NetworkId, web3 } from "@alephium/web3";
import { getClient } from "@donera/database";

const networkId: NetworkId = "devnet";

// TODO, get network form somewhere
const { nodeUrl } = alephiumConfig.networks[networkId];
web3.setCurrentNodeProvider(nodeUrl);
const deploys = loadDeployments(networkId);

const db = getClient();

const indexerCfg = {
  node: web3.getCurrentNodeProvider(),
  db,
};

const indexer = new SimpleEventIndexer(indexerCfg, {
  intervalMs: 4000,
  donera: deploys.contracts.Donera.contractInstance,
});

console.log("starting SIMPLE indexing..");

await indexer.start();
