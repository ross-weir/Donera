import { Group, Title } from "@mantine/core";
import { WalletConnectButtonLoader } from "./WalletConnectButton";
import dynamic from "next/dynamic";
import Image from "next/image";
import GitHubIcon from "./GitHubIcon";
import ColorSchemeToggleIcon from "./ColorSchemeToggleIcon";
import logo from "./logo.png";
import Link from "next/link";
import { LaunchFundButton } from "../LaunchFundButton";
import { SearchBar } from "./SearchBar";
import classes from "./Header.module.css";

// Fixes the loading jank of wallet connect button.
// Only noticable on first load in dev envs, maybe also on slow connections?
// Still probably worth having if it prevents jank for laggy users
const WalletConnectButton = dynamic(() => import("./WalletConnectButton"), {
  loading: () => <WalletConnectButtonLoader />,
  ssr: false,
});

export function Header() {
  return (
    <Group className={classes.container} justify="space-between">
      <Group>
        <Link href="/" className={classes.logoLink}>
          <Group>
            <Image src={logo} alt="Donera Logo" width={32} height={32} />
            <Title order={2}>Donera</Title>
          </Group>
        </Link>
      </Group>
      <Group>
        <LaunchFundButton style={{ border: "none" }} variant="default">
          Launch fundraiser
        </LaunchFundButton>
        <SearchBar />
        <WalletConnectButton />
        <GitHubIcon />
        <ColorSchemeToggleIcon />
      </Group>
    </Group>
  );
}
