import { NetworkId } from "@alephium/web3";
import { mainnet, testnet, TokenInfo } from "@alephium/token-list";

const devnetTokens: TokenInfo[] = [];

export function getTokensForNetwork(networkId: NetworkId): TokenInfo[] {
  switch (networkId) {
    case "mainnet":
      return mainnet.tokens;
    case "testnet":
      return testnet.tokens;
    case "devnet":
      return devnetTokens;
  }
}
