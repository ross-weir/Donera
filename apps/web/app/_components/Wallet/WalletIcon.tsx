"use client";

import { ExtractProps } from "@/_lib/types";
import { AlephiumConnectButton, useConnect, useWallet } from "@alephium/web3-react";
import { ActionIcon, Indicator } from "@mantine/core";
import { IconWallet, TablerIconsProps } from "@tabler/icons-react";
import { WalletMenu } from "./WalletMenu";
import { Account } from "@alephium/web3";
import { useDisclosure } from "@mantine/hooks";
import { DisconnectModal } from "./DisconnectModal";

// not exported from `@alephium/web3-react`
interface ConnectButtonRendererProps {
  show?: () => void;
  hide?: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  disconnect: () => Promise<void>;
  account?: Account;
  truncatedAddress?: string;
}

export type WalletIconProps = {
  actionProps: ExtractProps<typeof ActionIcon>;
  iconProps: TablerIconsProps;
};

export function WalletIconLoader({ actionProps, iconProps }: WalletIconProps) {
  return (
    <Indicator processing color="red">
      <ActionIcon {...actionProps}>
        <IconWallet {...iconProps} />
      </ActionIcon>
    </Indicator>
  );
}

export default function WalletIcon({ actionProps, iconProps }: WalletIconProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { connectionStatus } = useWallet();
  const { disconnect } = useConnect();
  const connected = connectionStatus === "connected";

  const onModalDisconnect = () => {
    close();
    disconnect();
  };

  return connected ? (
    <>
      <DisconnectModal
        onDisconnect={onModalDisconnect}
        opened={opened}
        onClose={close}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      />
      <WalletMenu onClick={open}>
        <Indicator color="green">
          <ActionIcon {...actionProps} aria-label="Wallet icon button">
            <IconWallet {...iconProps} />
          </ActionIcon>
        </Indicator>
      </WalletMenu>
    </>
  ) : (
    <AlephiumConnectButton.Custom>
      {({ show, isConnecting }: ConnectButtonRendererProps) => (
        <Indicator color="red" onClick={show} processing={isConnecting}>
          <ActionIcon {...actionProps} aria-label="Wallet icon button">
            <IconWallet {...iconProps} />
          </ActionIcon>
        </Indicator>
      )}
    </AlephiumConnectButton.Custom>
  );
}
