import { ExtractProps } from "@/_lib/types";
import { useBalance, useWallet } from "@alephium/web3-react";
import {
  Button,
  Group,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
  Text,
} from "@mantine/core";
import { TokenValueText } from "../TokenValueText";
import { ALPH_TOKEN_ID } from "@alephium/web3";
import { AlphAddressText } from "../AlphAddressText";

export type WalletMenuProps = { disconnect: () => void } & ExtractProps<typeof Menu>;

export function WalletMenu({ disconnect, children, ...rest }: WalletMenuProps) {
  const { account } = useWallet();
  const { balance } = useBalance();

  return (
    <Menu {...rest} width={250} withArrow>
      <MenuTarget>{children}</MenuTarget>
      <MenuDropdown>
        <MenuLabel>Wallet information</MenuLabel>
        <MenuItem>
          <Group justify="space-between">
            <Text size="sm">Address</Text>
            <AlphAddressText size="xs" address={account?.address as string} showTooltip={false} />
          </Group>
        </MenuItem>
        <MenuItem>
          <Group justify="space-between">
            <Text size="sm">Network</Text>
            <Text size="sm">{account?.network}</Text>
          </Group>
        </MenuItem>
        <MenuItem>
          <Group justify="space-between">
            <Text size="sm">Balance</Text>
            <TokenValueText size="sm" tokenId={ALPH_TOKEN_ID} amount={balance?.balance ?? "0"} />
          </Group>
        </MenuItem>
        <MenuDivider />
        <Button variant="subtle" c="red" fullWidth onClick={disconnect}>
          Disconnect
        </Button>
      </MenuDropdown>
    </Menu>
  );
}
