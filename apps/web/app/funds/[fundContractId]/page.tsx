import db, { Fund } from "@donera/database";
import { Container, Flex } from "@mantine/core";
import { notFound } from "next/navigation";
import { FundDetail } from "./_components/FundDetail";
import { DonateSection } from "./_components/DonateSection";
import { ALPH_TOKEN_ID } from "@alephium/web3";
import { fundSummary } from "@donera/database/funds";
import { Metadata } from "next";
import { cache } from "react";

export const dynamic = "force-dynamic";

const fundSummaryCached = cache(async (id: string) => fundSummary(db, id));

type SearchParam = {
  fundContractId: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParam;
}): Promise<Metadata> {
  const { fund } = await fundSummaryCached(searchParams.fundContractId);
  let title = "Donera";

  if (fund) {
    title += ` - ${fund.name}`;
  }

  return {
    title,
  };
}

function alphRaised(fund: Fund): string {
  return fund.balances?.find((b) => b.id === ALPH_TOKEN_ID)?.amount ?? "0";
}

export default async function FundDetailPage({ params }: { params: SearchParam }) {
  const { fundContractId } = params;
  const { fund, donationCount } = await fundSummaryCached(fundContractId);

  if (!fund) {
    notFound();
  }

  const {
    name,
    shortId,
    description,
    createdAt,
    beneficiary,
    organizer,
    verified,
    deadline,
    goal,
    donations,
    metadata,
  } = fund;

  return (
    <Container fluid>
      <Flex justify="center" align="start" gap="xl">
        <FundDetail
          name={name}
          imageSrc={metadata.image?.url}
          w={750}
          description={description}
          beneficiary={beneficiary}
          deadline={deadline.toLocaleString()}
          organizer={organizer}
          verified={verified}
          createdAt={createdAt.toLocaleString()}
        />
        <DonateSection
          miw={450}
          mt={60}
          fundContractId={fundContractId}
          shortId={shortId}
          goal={goal}
          alphRaised={alphRaised(fund)}
          latestDonations={donations}
          donationCount={donationCount}
          shadow="sm"
          p="xl"
          withBorder
        />
      </Flex>
    </Container>
  );
}
