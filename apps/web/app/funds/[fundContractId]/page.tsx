import db, { Fund } from "@donera/database";
import { Container, Flex, Skeleton, Image } from "@mantine/core";
import { notFound } from "next/navigation";
import { FundDetail } from "./_components/FundDetail";
import { DonateSection } from "./_components/DonateSection";
import { ALPH_TOKEN_ID } from "@alephium/web3";
import { fundSummary } from "@donera/database/funds";
import { Metadata } from "next";
import { Suspense, cache } from "react";
import NextImage from "next/image";
import { cidToUrl } from "@/_lib/donera";

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

  const { shortId, goal, donations, metadata } = fund;
  // fallback to url
  // https://github.com/ross-weir/Donera/issues/73
  const image = cidToUrl(metadata.image?.cid) || metadata.image?.url;

  return (
    <Container fluid>
      <Flex justify="center" align="start" gap="xl">
        <FundDetail
          fund={fund}
          image={
            <Suspense fallback={<Skeleton height="425px" />}>
              <Image
                component={NextImage}
                alt="Fundraiser image"
                src={image}
                width={500}
                height={500}
                radius="md"
              />
            </Suspense>
          }
          w={750}
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
