import { ALPH_TOKEN_ID, NetworkId, ONE_ALPH } from "@alephium/web3";
import { DoneraDapp } from "@donera/dapp";
import { loadDeployments } from "@donera/dapp/deploys";
import { UiFee } from "@donera/dapp/fees";

export const getNetwork = (): NetworkId => {
  const networkId = process.env.NEXT_PUBLIC_DONERA_NETWORK;

  if (!networkId) {
    throw new Error("NEXT_PUBLIC_DONERA_NETWORK env var was not set");
  }

  if (!["mainnet", "testnet", "devnet"].includes(networkId)) {
    throw new Error(`Invalid network provided for NEXT_PUBLIC_DONERA_NETWORK: ${networkId}`);
  }

  return networkId as NetworkId;
};

export const getExplorerUrl = (): string => {
  switch (getNetwork()) {
    case "mainnet":
      return "https://explorer.alephium.org";
    case "testnet":
      return "https://testnet.alephium.org";
    case "devnet":
      return "http://localhost:23000";
  }
};

export const getExternalLinkForTx = (txId: string): string => {
  return `${getExplorerUrl()}/transactions/${txId}`;
};

// Applied to every "fund create", "donate", "finalize fund" operation
const getUiFee = (): UiFee => {
  const { deployerAddress } = loadDeployments(getNetwork());

  return {
    // UI developers address
    uiDev: deployerAddress,
    // Fee in full decimal format (atto format when the token id in ALPH, for example)
    uiFee: ONE_ALPH.toString(),
    // Token ID that you want to accept in fees
    uiFeeToken: ALPH_TOKEN_ID,
  };
};

let donera: DoneraDapp | undefined;

export const getDoneraDapp = (): DoneraDapp => {
  if (donera) {
    return donera;
  }

  donera = DoneraDapp.forNetwork(getNetwork(), getUiFee());

  return donera;
};

export const cidToUrl = (cid?: string | null) =>
  cid ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL}/${cid}` : "";
