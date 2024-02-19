import { Center, Container, Group, Space, Title } from "@mantine/core";
import db, { Fund } from "@donera/database";
import classes from "./page.module.css";
import { FundCard } from "./_components/FundCard";
import { ALPH_TOKEN_ID } from "@alephium/web3";

// ensure we always get up-to-date funds
export const dynamic = "force-dynamic";

function alphRaised(fund: Fund): string {
  return fund.balances?.find((b) => b.id === ALPH_TOKEN_ID)?.amount ?? "0";
}

export default async function BrowseFundsPage() {
  const funds = await db.fund.findMany({});

  return (
    <Container className={classes.container} size={1000}>
      <Center>
        <Title order={1}>Browse fundraisers listed on Donera</Title>
      </Center>
      <Space h="xl" />
      <Group justify="space-between">
        {funds.map((f) => (
          <FundCard key={f.id} fund={f} alphRaised={alphRaised(f)} miw={400} />
        ))}
      </Group>
    </Container>
  );
}
