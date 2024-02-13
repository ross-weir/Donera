import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { AlephiumWalletProvider } from "@alephium/web3-react";
import { NetworkId } from "@alephium/web3";

export const metadata: Metadata = {
  title: "Donera",
  description: "A decentralized crowdfunding platform built on Alephium",
};

// TODO: should validate this
const networkId = process.env.NEXT_PUBLIC_DONERA_NETWORK as NetworkId;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <AlephiumWalletProvider network={networkId}>{children}</AlephiumWalletProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
