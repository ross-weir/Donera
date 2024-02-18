import { NetworkId } from "@alephium/web3";
import tokenMetadata, { TokenInfo } from "@alephium/token-list";

const devnetTokens = [];

export function getTokensForNetwork(networkId: NetworkId): TokenInfo[] {
  if (networkId === "devnet") {
    return devnetTokens;
  }

  return tokenMetadata[networkId].tokens.tokens;
}
