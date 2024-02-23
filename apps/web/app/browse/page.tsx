import { Center, Container, Space, Title, Text, Stack, SimpleGrid } from "@mantine/core";
import db, { Fund } from "@donera/database";
import { FundCard } from "./_components/FundCard";
import { ALPH_TOKEN_ID } from "@alephium/web3";
import { EmptyPlaceholder } from "./_components/EmptyPlaceholder";
import { SearchInput } from "./_components/SearchInput";
import { fundTextSearch } from "@donera/database/search";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donera - Browse fundraisers",
};

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
    <Container size={1200}>
      <Center style={{ textAlign: "center" }}>
        <Stack>
          <Title order={1}>Browse fundraisers listed on Donera</Title>
          <Text size="sm">Find fundraisers by name, description or Alephium address</Text>
        </Stack>
      </Center>
      <Space h="lg" />
      <Suspense>
        <Container size={600}>
          <SearchInput />
        </Container>
      </Suspense>
      <Space h="xl" />
      {!funds.length ? (
        <EmptyPlaceholder text="No fundraisers found" />
      ) : (
        <SimpleGrid cols={2} spacing="xl" verticalSpacing="xl">
          {funds.map((fund) => (
            <FundCard key={fund.id} fund={fund} alphRaised={alphRaised(fund)} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
