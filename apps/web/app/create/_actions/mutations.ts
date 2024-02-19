"use server";

import { redirect } from "next/navigation";
import { CreateFundResult } from "@donera/dapp";
import { getClient } from "@donera/database";

export async function saveFund(
  { fundContractId, ...rest }: CreateFundResult,
  signerAddress: string
) {
  const client = getClient();
  await client.fund.create({
    data: {
      ...rest,
      id: fundContractId,
      verified: false,
      organizer: signerAddress,
    },
  });
  redirect(`/funds/${fundContractId}`);
}
