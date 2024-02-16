"use server";

import { redirect } from "next/navigation";
import { CreateFundResult } from "@donera/dapp";
import { Client } from "@donera/database";

export async function onSubmittedFund({ fundContractId, txId, ...rest }: CreateFundResult) {
  const client = new Client();
  await client.fund.create({
    data: {
      ...rest.params,
      fundContractId,
      creationTx: {
        id: txId,
        verified: false,
        confirmed: false,
      },
    },
  });
  redirect(`/funds/${fundContractId}`);
}
