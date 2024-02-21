import { ExtractProps } from "@/_lib/types";
import { Account } from "@alephium/web3";
import { AlephiumConnectButton, useWallet } from "@alephium/web3-react";
import { Button } from "@mantine/core";
import { IconWallet } from "@tabler/icons-react";
import { PropsWithChildren } from "react";

type ButtonProps = ExtractProps<typeof Button>;

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

const baseButtonProps: ButtonProps = {
  leftSection: <IconWallet size={18} />,
};

function ConnectButton({ show, isConnecting, ...props }: ButtonProps & ConnectButtonRendererProps) {
  return (
    <Button onClick={show} loading={isConnecting} {...props} {...baseButtonProps}>
      Connect
    </Button>
  );
}

export function ConnectButtonLoader(props: ButtonProps = {}) {
  return <Button {...baseButtonProps} {...props} loading />;
}

export default function FallbackConnectButton({
  children,
  ...props
}: PropsWithChildren<ButtonProps>) {
  const { connectionStatus } = useWallet();

  return connectionStatus === "connected" ? (
    <>{children}</>
  ) : (
    <AlephiumConnectButton.Custom>
      {(connectProps: ConnectButtonRendererProps) => (
        <ConnectButton {...connectProps} {...props} type="button" />
      )}
    </AlephiumConnectButton.Custom>
  );
}
