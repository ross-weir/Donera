import { PrismaClient } from "@donera/database";
import { Container, Group } from "@mantine/core";
import { notFound } from "next/navigation";
import { FundDetail } from "./_components/FundDetail";
import classes from "./page.module.css";

export default async function FundDetailPage({ params }: { params: { fundContractId: string } }) {
  // TODO also fetch contract balance
  const client = new PrismaClient();
  const fund = await client.fund.findFirst({
    where: {
      fundContractId: params.fundContractId,
    },
  });

  if (!fund) {
    notFound();
  }

  const { name, description, creationTx, beneficiary, deadline } = fund;

  function DonateFund() {
    return <p>DONATE TO THE FUND BRO</p>;
  }

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
          organizer={creationTx.signerAddress}
          confirmed={creationTx.confirmed && creationTx.verified}
          createdAt={creationTx.createdAt.toLocaleString()}
        />
        <DonateFund />
      </Group>
    </Container>
  );
}
