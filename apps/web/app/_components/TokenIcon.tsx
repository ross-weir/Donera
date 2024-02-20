import { getNetwork } from "@/_lib/donera";
import { ALPH, TokenInfo } from "@alephium/token-list";
import { getTokensForNetwork } from "@donera/dapp";
import { Avatar, AvatarProps, Tooltip } from "@mantine/core";

export type TokenIconProps = {
  tokenId: string;
  showNamePopup?: boolean;
} & AvatarProps;

type TokenInfoMap = Record<string, TokenInfo | undefined>;

const tokenInfoMap: TokenInfoMap = [
  {
    ...ALPH,
    logoURI:
      "https://raw.githubusercontent.com/alephium/alephium-brand-guide/master/logos/grey/Logo-Icon-Grey.png",
  },
  ...getTokensForNetwork(getNetwork()),
].reduce((acc, val) => {
  acc[val.id] = val;
  return acc;
}, {} as TokenInfoMap);

export function TokenIcon({ tokenId, showNamePopup = false, ...rest }: TokenIconProps) {
  const token = tokenInfoMap[tokenId];
  return (
    <Tooltip label={token?.name} disabled={!showNamePopup || !token}>
      <Avatar {...rest} src={token?.logoURI} />
    </Tooltip>
  );
}
