import { Center, Container, Group, Space, Title, Text, Stack } from "@mantine/core";
import db, { Fund } from "@donera/database";
import classes from "./page.module.css";
import { FundCard } from "./_components/FundCard";
import { ALPH_TOKEN_ID } from "@alephium/web3";
import { EmptyPlaceholder } from "./_components/EmptyPlaceholder";
import { SearchInput } from "./_components/SearchInput";
import { fundTextSearch } from "@donera/database/search";
import { Suspense } from "react";

function alphRaised(fund: Fund): string {
  return fund.balances?.find((b) => b.id === ALPH_TOKEN_ID)?.amount ?? "0";
}

type SearchParams = {
  s?: string;
};

export default async function BrowseFundsPage({ searchParams }: { searchParams: SearchParams }) {
  const funds = await db.fund.findMany({
    where: {
      verified: true,
      ...fundTextSearch(searchParams.s),
    },
  });

  return (
    <Container className={classes.container} size={1000}>
      <Center style={{ textAlign: "center" }}>
        <Stack>
          <Title order={1}>Browse fundraisers listed on Donera</Title>
          <Text size="sm">Find fundraisers by name, description or Alephium address</Text>
        </Stack>
      </Center>
      <Space h="lg" />
      <Suspense>
        <Container size={400}>
          <SearchInput variant="filled" />
        </Container>
      </Suspense>
      <Space h="xl" />
      {!funds.length ? (
        <EmptyPlaceholder text="No fundraisers found" />
      ) : (
        <Group justify="space-between">
          {funds.map((f) => (
            <FundCard key={f.id} fund={f} alphRaised={alphRaised(f)} miw={400} maw={400} />
          ))}
        </Group>
      )}
    </Container>
  );
}
