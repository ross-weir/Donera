import { getNetwork } from "@/_lib/donera";
import { ALPH } from "@alephium/token-list";
import { ALPH_TOKEN_ID, prettifyTokenAmount } from "@alephium/web3";
import { getTokensForNetwork } from "@donera/dapp";
import { TextProps, Text } from "@mantine/core";

export type TokenValueText = {
  tokenId: string;
  amount: string;
  showSymbol?: boolean;
} & TextProps;

const tokens = getTokensForNetwork(getNetwork());

function getToken(id: string) {
  if (id === ALPH_TOKEN_ID) {
    return ALPH;
  }
  return tokens.find((t) => t.id === id);
}

export function TokenValueText({ tokenId, amount, showSymbol = true, ...rest }: TokenValueText) {
  const token = getToken(tokenId);
  const prettyAmount = prettifyTokenAmount(amount, token?.decimals ?? 18);
  const symbol = token?.symbol ?? "Unverified token";
  const name = token?.name ?? "Unverified token";
  const tokenName = showSymbol ? symbol : name;

  return (
    <Text {...rest}>
      {prettyAmount} {tokenName}
    </Text>
  );
}
