import db, { Fund } from "@donera/database";
import { Container, Flex, Skeleton } from "@mantine/core";
import { notFound } from "next/navigation";
import { FundDetail } from "./_components/FundDetail";
import { DonateSection } from "./_components/DonateSection";
import { ALPH_TOKEN_ID } from "@alephium/web3";
import { fundSummary } from "@donera/database/funds";
import { Metadata } from "next";
import { Suspense, cache } from "react";
import { ImageWithPlaceholder } from "@/_components/ImageWithPlaceholder";
import { cidToUrl } from "@/_lib/donera";

export const dynamic = "force-dynamic";

const fundSummaryCached = cache(async (id: string) => fundSummary(db, id));

type Params = {
  fundContractId: string;
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { fund } = await fundSummaryCached(params.fundContractId);
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

export default async function FundDetailPage({ params }: { params: Params }) {
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
              <ImageWithPlaceholder height="425px" sizes="500px" src={image!} />
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
