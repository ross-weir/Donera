import db, { Fund } from "@donera/database";
import { Container, Group } from "@mantine/core";
import { notFound } from "next/navigation";
import { FundDetail } from "./_components/FundDetail";
import classes from "./page.module.css";
import { DonateSection } from "./_components/DonateSection";
import { ALPH_TOKEN_ID } from "@alephium/web3";

export const dynamic = "force-dynamic";

function alphRaised(fund: Fund): string {
  return fund.balances?.find((b) => b.id === ALPH_TOKEN_ID)?.amount ?? "0";
}

export default async function FundDetailPage({ params }: { params: { fundContractId: string } }) {
  const { fundContractId } = params;
  const fund = await db.fund.findFirst({
    where: {
      id: fundContractId,
    },
  });

  if (!fund) {
    notFound();
  }

  const {
    name,
    description,
    createdAt,
    confirmed,
    beneficiary,
    organizer,
    verified,
    deadline,
    goal,
  } = fund;

  return (
    <Container fluid className={classes.container}>
      <Group justify="center" gap="xl">
        <FundDetail
          w={650}
          name={name}
          imageSrc="https://placehold.co/900x400?text=Placeholder"
          description={description}
          beneficiary={beneficiary}
          deadline={deadline.toLocaleString()}
          organizer={organizer}
          confirmed={confirmed && verified}
          createdAt={createdAt.toLocaleString()}
        />
        <DonateSection
          w={450}
          fundContractId={fundContractId}
          goal={goal}
          alphRaised={alphRaised(fund)}
          shadow="sm"
          p="xl"
          withBorder
        />
      </Group>
    </Container>
  );
}
