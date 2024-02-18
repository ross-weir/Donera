"use server";

import { redirect } from "next/navigation";
import { CreateFundResult } from "@donera/dapp";
import { getClient } from "@donera/database";

export async function saveFund(
  { fundContractId, txId, ...rest }: CreateFundResult,
  signerAddress: string
) {
  const client = getClient();
  await client.fund.create({
    data: {
      ...rest,
      fundContractId,
      creationTx: {
        id: txId,
        signerAddress,
        verified: false,
        confirmed: false,
      },
    },
  });
  redirect(`/funds/${fundContractId}`);
}
