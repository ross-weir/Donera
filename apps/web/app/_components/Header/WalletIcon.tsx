"use client";

import { ExtractProps } from "@/_lib/types";
import { useBalance, useConnect, useWallet } from "@alephium/web3-react";
import { ActionIcon, Indicator } from "@mantine/core";
import { IconWallet, TablerIconsProps } from "@tabler/icons-react";

export type WalletIconProps = {
  actionProps: ExtractProps<typeof ActionIcon>;
  iconProps: TablerIconsProps;
};

export default function WalletIcon({ actionProps, iconProps }: WalletIconProps) {
  const { connectionStatus } = useWallet();

  return (
    <Indicator color={connectionStatus === "connected" ? "green" : "red"}>
      <ActionIcon {...actionProps} aria-label="Wallet icon button">
        <IconWallet {...iconProps} />
      </ActionIcon>
    </Indicator>
  );
}
