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
import { useState } from "react";
import { IconLogout } from "@tabler/icons-react";

export type WalletMenuProps = { onClick: () => void } & ExtractProps<typeof Menu>;

export function WalletMenu({ onClick, children, ...rest }: WalletMenuProps) {
  const [opened, setOpened] = useState(false);
  const { account } = useWallet();
  const { balance } = useBalance();

  const onDisconnectClick = () => {
    setOpened(false);
    onClick();
  };

  return (
    <Menu {...rest} opened={opened} onChange={setOpened} width={250} withArrow>
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
        <Button
          variant="subtle"
          c="red"
          fullWidth
          onClick={onDisconnectClick}
          leftSection={<IconLogout size={14} />}
        >
          Disconnect
        </Button>
      </MenuDropdown>
    </Menu>
  );
}
