import { Text, Group, Title } from "@mantine/core";
import { WalletConnectButtonLoader } from "./WalletConnectButton";
import dynamic from "next/dynamic";
import Image from "next/image";
import GitHubIcon from "./GitHubIcon";
import ColorSchemeToggleIcon from "./ColorSchemeToggleIcon";
import logo from "./logo.png";

// Fixes the loading jank of wallet connect button.
// Takes half a second for the button to appear for some reason, this adds a loader placeholder
const WalletConnectButton = dynamic(() => import("./WalletConnectButton"), {
  loading: () => <WalletConnectButtonLoader />,
  ssr: false,
});

export default function Header() {
  return (
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
  );
}
