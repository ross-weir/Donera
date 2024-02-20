"use server";

import { redirect } from "next/navigation";
import { CreateFundResult } from "@donera/dapp";
import db from "@donera/database";
import { nanoid } from "nanoid";

export async function saveFund({ fundContractId, ...rest }: CreateFundResult) {
  await db.fund.create({
    data: {
      ...rest,
      id: fundContractId,
      shortId: nanoid(10),
      verified: false,
    },
  });
  redirect(`/funds/${fundContractId}`);
}
