import { Client } from "@donera/database";

export default async function FundDetailPage({ params }: { params: { fundContractId: string } }) {
  const client = new Client();
  const fund = await client.fund.findFirst({
    where: {
      fundContractId: params.fundContractId,
    },
  });

  return <p>{JSON.stringify(fund)}</p>;
}
