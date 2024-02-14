"use client";

import { Account } from "@alephium/web3";
import { AlephiumConnectButton } from "@alephium/web3-react";
import { Button, ButtonProps, ElementProps } from "@mantine/core";
import { IconWallet } from "@tabler/icons-react";

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

interface ConnectButtonProps extends ConnectButtonRendererProps {
  loading?: boolean;
}

function BaseConnectButton(props: ElementProps<"button"> & ButtonProps) {
  return (
    <Button {...props} variant="light" leftSection={<IconWallet size={18} />}>
      Connect
    </Button>
  );
}

function ConnectButton({ show, isConnecting }: ConnectButtonProps) {
  return <BaseConnectButton onClick={show} loading={isConnecting} />;
}

export function WalletConnectButtonLoader() {
  return <BaseConnectButton loading />;
}

function ConnectedWalletButton({ disconnect, truncatedAddress }: ConnectButtonRendererProps) {
  return (
    <Button onClick={disconnect} variant="light" leftSection={<IconWallet size={18} />}>
      {truncatedAddress}
    </Button>
  );
}

export default function WalletConnectButton() {
  return (
    <AlephiumConnectButton.Custom>
      {(props: ConnectButtonRendererProps) =>
        props.isConnected ? <ConnectedWalletButton {...props} /> : <ConnectButton {...props} />
      }
    </AlephiumConnectButton.Custom>
  );
}
