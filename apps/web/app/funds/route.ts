import { NextRequest, NextResponse } from "next/server";
import { cidToUrl } from "@/_lib/donera";
import { blob } from "@/_lib/server";
import db from "@donera/database";
import { CreateFundResult } from "@donera/dapp";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const data = {
    txId: formData.get("txId"),
    fundContractId: formData.get("fundContractId"),
    name: formData.get("name"),
    description: formData.get("description"),
    goal: formData.get("goal"),
    deadline: new Date(formData.get("deadline") as string),
    beneficiary: formData.get("beneficiary"),
    organizer: formData.get("organizer"),
  } as any as CreateFundResult;
  const { fundContractId, ...rest } = data;
  const file = formData.get("image") as File;
  const { id } = await blob.put(data.fundContractId, await file.arrayBuffer());

  // storing url to ensure there's a way to get the image until the cid is stored onchain
  // https://github.com/ross-weir/Donera/issues/73
  const metadata = { image: { cid: id, url: cidToUrl(id) } };

  const fund = await db.fund.upsert({
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
  const redirectUrl = new URL(`/funds/${fundContractId}`, request.url);
  return NextResponse.json(fund);
  console.log(redirectUrl, request.url);
  return NextResponse.redirect(redirectUrl);
}
