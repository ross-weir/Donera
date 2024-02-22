import db, { Fund } from "@donera/database";
import { Container, Flex } from "@mantine/core";
import { notFound } from "next/navigation";
import { FundDetail } from "./_components/FundDetail";
import classes from "./page.module.css";
import { DonateSection } from "./_components/DonateSection";
import { ALPH_TOKEN_ID } from "@alephium/web3";
import { fundSummary } from "@donera/database/funds";

export const dynamic = "force-dynamic";

function alphRaised(fund: Fund): string {
  return fund.balances?.find((b) => b.id === ALPH_TOKEN_ID)?.amount ?? "0";
}

export default async function FundDetailPage({ params }: { params: { fundContractId: string } }) {
  const { fundContractId } = params;
  const { fund, donationCount } = await fundSummary(db, fundContractId);

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
  } = fund;

  return (
    <Container fluid className={classes.container}>
      <Flex justify="center" align="start" gap="xl">
        <FundDetail
          w={650}
          name={name}
          imageSrc="https://placehold.co/900x400?text=Placeholder"
          description={description}
          beneficiary={beneficiary}
          deadline={deadline.toLocaleString()}
          organizer={organizer}
          verified={verified}
          createdAt={createdAt.toLocaleString()}
        />
        <DonateSection
          miw={450}
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
