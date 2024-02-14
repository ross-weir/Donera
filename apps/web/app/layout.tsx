import "@mantine/core/styles.css";
import type { Metadata } from "next";
import Image from "next/image";
import { AppShellMain, ColorSchemeScript, MantineProvider, Text } from "@mantine/core";
import { AlephiumWalletProvider } from "@alephium/web3-react";
import { NetworkId } from "@alephium/web3";
import { Title, AppShell, AppShellHeader, Group } from "@mantine/core";
import logo from "./_components/Header/logo.png";
import GitHubIcon from "./_components/Header/GitHubIcon";
import ColorSchemeToggleIcon from "./_components/Header/ColorSchemeToggleIcon";
import dynamic from "next/dynamic";
import { WalletConnectButtonLoader } from "./_components/Header/WalletConnectButton";

export const metadata: Metadata = {
  title: "Donera",
  description: "A decentralized crowdfunding platform built on Alephium",
};

// TODO: should validate this
const networkId = process.env.NEXT_PUBLIC_DONERA_NETWORK as NetworkId;

// Fixes the loading jank of wallet connect button.
// Takes half a second for the button to appear for some reason, this adds a loader placeholder
const WalletConnectButton = dynamic(() => import("./_components/Header/WalletConnectButton"), {
  loading: () => <WalletConnectButtonLoader />,
  ssr: false,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <AlephiumWalletProvider network={networkId}>
            <AppShell header={{ height: 60 }}>
              <AppShellHeader>
                <Group h="100%" px="md" justify="space-between">
                  <Group>
                    <Image src={logo} alt="Donera Logo" width={32} height={32} />
                    <Title order={2}>
                      <Text inherit component="a" href="/">
                        Donera
                      </Text>
                    </Title>
                  </Group>
                  <Group>
                    {/** search funds bar */}
                    {/** create fund button */}
                    <WalletConnectButton />
                    <GitHubIcon />
                    <ColorSchemeToggleIcon />
                  </Group>
                </Group>
              </AppShellHeader>
              <AppShellMain>{children}</AppShellMain>
            </AppShell>
          </AlephiumWalletProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
