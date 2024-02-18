import { getClient } from "@donera/database";
import { Container, Group } from "@mantine/core";
import { notFound } from "next/navigation";
import { FundDetail } from "./_components/FundDetail";
import classes from "./page.module.css";
import { DonateSection } from "./_components/DonateSection";
import { addressFromContractId, web3 } from "@alephium/web3";

export default async function FundDetailPage({ params }: { params: { fundContractId: string } }) {
  const { fundContractId } = params;
  const client = getClient();
  // TODO: cache this, fund fields dont change
  const fund = await client.fund.findFirst({
    where: {
      fundContractId,
    },
  });

  if (!fund) {
    notFound();
  }

  // might be better to fetch this client-side so it's always up-to-date?
  // at least until we start tracking balances
  // or revalidate it in someway using server actions on donation?
  const { balance } = await web3
    .getCurrentNodeProvider()
    .addresses.getAddressesAddressBalance(
      addressFromContractId(fundContractId),
      {},
      { cache: "no-cache" }
    );

  const { name, description, creationTx, beneficiary, deadline, goal } = fund;

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
        <DonateSection
          w={450}
          fundContractId={fundContractId}
          goal={goal}
          alphRaised={balance}
          shadow="sm"
          p="xl"
          withBorder
        />
      </Group>
    </Container>
  );
}
