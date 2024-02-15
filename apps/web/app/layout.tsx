import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import type { Metadata } from "next";
import { AppShellMain, ColorSchemeScript } from "@mantine/core";
import { AppShell, AppShellHeader } from "@mantine/core";
import DoneraProvider from "./_components/DoneraProvider";
import Header from "./_components/Header";

export const metadata: Metadata = {
  title: "Donera",
  description: "A decentralized crowdfunding platform built on Alephium",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // set web3.setCurrentNodeProvider()
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <DoneraProvider>
          <AppShell header={{ height: 60 }}>
            <AppShellHeader>
              <Header />
            </AppShellHeader>
            <AppShellMain>{children}</AppShellMain>
          </AppShell>
        </DoneraProvider>
      </body>
    </html>
  );
}
