import { Center, Container, Divider, Group, Space, Title } from "@mantine/core";
import { PrismaClient } from "@donera/database";
import classes from "./page.module.css";
import { FundCard } from "./_components/FundCard";

export default async function BrowseFundsPage() {
  const db = new PrismaClient();
  const funds = await db.fund.findMany();

  return (
    <Container className={classes.container} size={1000}>
      <Center>
        <Title order={1}>Browse fundraisers listed on Donera</Title>
      </Center>
      <Space h="xl" />
      <Group justify="space-between">
        {funds.map((f) => (
          <FundCard key={f.id} fund={f} alphRaised="0" miw={400} />
        ))}
      </Group>
    </Container>
  );
}
