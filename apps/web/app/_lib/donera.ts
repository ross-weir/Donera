import { NetworkId } from "@alephium/web3";
import { DoneraDapp } from "@donera/dapp";

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

let donera: DoneraDapp | undefined;

export const getDoneraDapp = (): DoneraDapp => {
  if (donera) {
    return donera;
  }

  donera = DoneraDapp.forNetwork(getNetwork());

  return donera;
};
