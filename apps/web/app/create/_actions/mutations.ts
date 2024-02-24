"use server";

import { redirect } from "next/navigation";
import { CreateFundResult } from "@donera/dapp";
import db from "@donera/database";
import { nanoid } from "nanoid";
import { blob } from "@/_lib/server";

export async function saveFund({ fundContractId, ...rest }: CreateFundResult, formData: FormData) {
  const file = formData.get("image") as File;
  // todo, we should return a cid instead
  const { url } = await blob.put(fundContractId, await file.arrayBuffer());
  const metadata = { image: { url } };

  // there's a race condition where the indexer can insert the record before
  // we have a chance to optimistically create it. Use upsert.
  // Not sure if this is just a devnet thing or realistic
  await db.fund.upsert({
    where: {
      id: fundContractId,
    },
    update: {
      metadata,
    },
    create: {
      ...rest,
      id: fundContractId,
      shortId: nanoid(10),
      verified: false,
      metadata,
    },
  });
  redirect(`/funds/${fundContractId}`);
}
