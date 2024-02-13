import { Button, Title } from "@mantine/core";
import { AlephiumConnectButton } from "@alephium/web3-react";

export default function Home() {
  return (
    <div>
      <Title order={1}>Testing mantine</Title>
      <Button>Test button</Button>
      <AlephiumConnectButton />
    </div>
  );
}
