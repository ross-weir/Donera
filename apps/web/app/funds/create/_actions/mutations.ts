"use server";

import { redirect } from "next/navigation";
import { CreateFundResult } from "@donera/dapp";
import { PrismaClient } from "@donera/database";

type SaveFundParams = Omit<CreateFundResult, "goal"> & {
  goal: string;
};

export async function saveFund(
  { fundContractId, txId, goal, ...rest }: SaveFundParams,
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
      goal,
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
