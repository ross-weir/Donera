"use server";

import { redirect } from "next/navigation";
import { CreateFundResult } from "@donera/dapp";
import db from "@donera/database";

export async function saveFund({ fundContractId, ...rest }: CreateFundResult) {
  await db.fund.create({
    data: {
      ...rest,
      id: fundContractId,
      verified: false,
    },
  });
  redirect(`/funds/${fundContractId}`);
}
