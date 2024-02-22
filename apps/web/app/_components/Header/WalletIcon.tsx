"use client";

import { ExtractProps } from "@/_lib/types";
import { useConnect, useWallet } from "@alephium/web3-react";
import { ActionIcon, Indicator } from "@mantine/core";
import { IconWallet, TablerIconsProps } from "@tabler/icons-react";
import { WalletMenu } from "../Wallet";

export type WalletIconProps = {
  actionProps: ExtractProps<typeof ActionIcon>;
  iconProps: TablerIconsProps;
};

export default function WalletIcon({ actionProps, iconProps }: WalletIconProps) {
  const { connectionStatus } = useWallet();
  const { disconnect, connect } = useConnect();
  const connected = connectionStatus === "connected";
  const connecting = connectionStatus === "connecting";
  const onIconClick = () => {
    if (!connected) {
      connect();
    }
  };
  const icon = (
    <Indicator processing={connecting} color={connected ? "green" : "red"} onClick={onIconClick}>
      <ActionIcon {...actionProps} aria-label="Wallet icon button">
        <IconWallet {...iconProps} />
      </ActionIcon>
    </Indicator>
  );

  return connected ? <WalletMenu disconnect={disconnect}>{icon}</WalletMenu> : <>{icon}</>;
}
