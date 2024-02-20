"use client";

import { AlephiumWalletProvider } from "@alephium/web3-react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import AlephiumWeb3 from "./AlephiumWeb3";
import { getNetwork } from "../_lib/donera";

export default function DoneraProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <Notifications />
      <AlephiumWalletProvider network={getNetwork()}>
        <AlephiumWeb3>{children}</AlephiumWeb3>
      </AlephiumWalletProvider>
    </MantineProvider>
  );
}
