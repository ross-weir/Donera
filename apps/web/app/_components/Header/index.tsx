import { Text, Group, Title } from "@mantine/core";
import { WalletConnectButtonLoader } from "./WalletConnectButton";
import dynamic from "next/dynamic";
import Image from "next/image";
import GitHubIcon from "./GitHubIcon";
import ColorSchemeToggleIcon from "./ColorSchemeToggleIcon";
import logo from "./logo.png";
import Link from "next/link";

// Fixes the loading jank of wallet connect button.
// This is really noticeable in dev builds but only happens for a split second in prod builds
const WalletConnectButton = dynamic(() => import("./WalletConnectButton"), {
  loading: () => <WalletConnectButtonLoader />,
  ssr: false,
});

export default function Header() {
  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Link href="/">
          <Image src={logo} alt="Donera Logo" width={32} height={32} />
        </Link>
        <Link href="/" style={{ textDecoration: "none", color: "unset" }}>
          <Title order={2}>Donera</Title>
        </Link>
      </Group>
      <Group>
        {/** search funds bar */}
        {/** create fund button */}
        <WalletConnectButton />
        <GitHubIcon />
        <ColorSchemeToggleIcon />
      </Group>
    </Group>
  );
}
