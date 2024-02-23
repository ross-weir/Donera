import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "./_lib/server/init";

import type { Metadata } from "next";
import { AppShellFooter, AppShellMain, ColorSchemeScript } from "@mantine/core";
import { AppShell, AppShellHeader } from "@mantine/core";
import DoneraProvider from "./_components/DoneraProvider";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import classes from "./layout.module.css";

export const metadata: Metadata = {
  title: "Donera - Decentralized crowdfunding",
  description: "A decentralized crowdfunding platform built on Alephium",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <DoneraProvider>
          <AppShell
            styles={{
              main: { flex: 1, minHeight: 0 },
              footer: { position: "relative" },
            }}
          >
            <div className={classes.appContainer}>
              <AppShellHeader>
                <Header />
              </AppShellHeader>
              <AppShellMain>{children}</AppShellMain>
              <AppShellFooter>
                <Footer />
              </AppShellFooter>
            </div>
          </AppShell>
        </DoneraProvider>
      </body>
    </html>
  );
}
