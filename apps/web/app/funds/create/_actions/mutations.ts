"use server";

import { redirect } from "next/navigation";
import { CreateFundResult } from "@donera/dapp";
import { PrismaClient } from "@donera/database";

export async function saveFund(
  { fundContractId, txId, goal, ...rest }: CreateFundResult,
  signerAddress: string
) {
  const client = new PrismaClient();
  await client.fund.create({
    data: {
      ...rest,
      fundContractId,
      // if the bigint is too large prisma needs it as a bigint string
      // the function only accepts number | bigint though so we have to
      // do this hack to get it accepted
      goal: goal.toString() as any as bigint,
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
