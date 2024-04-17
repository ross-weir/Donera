import db from "@donera/database";
import { nanoid } from "nanoid";
import { blob } from "@/_lib/server";
import { getDoneraDapp } from "@/_lib/donera";
import { convertAlphAmountWithDecimals, stringToHex } from "@alephium/web3";
import { OffchainMetadata } from "@donera/dapp";
import { NextRequest, NextResponse } from "next/server";

type SaveFundParam = {
  name: string;
  description: string;
  goal: string;
  deadline: string;
  beneficiary: string;
  organizer: string;
  image: File;
};

function getFormFieldOrThrow<T extends FormDataEntryValue = string>(
  formData: FormData,
  field: string
): T {
  const value = formData.get(field);

  if (!value) {
    throw new Error(`Field was missing: ${field}`);
  }

  return value as T;
}

function parseFormData(formData: FormData): SaveFundParam {
  return {
    name: getFormFieldOrThrow(formData, "name"),
    description: getFormFieldOrThrow(formData, "description"),
    goal: getFormFieldOrThrow(formData, "goal"),
    deadline: getFormFieldOrThrow(formData, "deadline"),
    beneficiary: getFormFieldOrThrow(formData, "beneficiary"),
    organizer: getFormFieldOrThrow(formData, "organizer"),
    image: getFormFieldOrThrow<File>(formData, "image"),
  };
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const { image, deadline, ...param } = parseFormData(formData);
  const imageBuf = await image.arrayBuffer();
  const { url: imageUrl } = await blob.put(nanoid(32), new Blob([imageBuf]));
  const offchainMetadata: OffchainMetadata = {
    name: param.name,
    description: param.description,
    imageUrl,
  };
  const { url: metadataUrl } = await blob.put(
    nanoid(32),
    new Blob([JSON.stringify(offchainMetadata)], { type: "application/json" })
  );
  const metadata = { image: { url: imageUrl } };
  const deadlineDate = new Date(deadline);
  const fundContractId = getDoneraDapp().deriveFundContractId({
    deadlineTimestamp: BigInt(Math.floor(deadlineDate.getTime() / 1000)),
    goal: convertAlphAmountWithDecimals(param.goal)!,
    beneficiary: param.beneficiary,
    organizer: param.organizer,
    metadataUrl: stringToHex(metadataUrl),
  });
  const fund = await db.fund.create({
    data: {
      ...param,
      id: fundContractId,
      deadline: deadlineDate,
      shortId: nanoid(10),
      verified: false,
      metadata,
      metadataUrl,
    },
  });
  return NextResponse.json(fund);
}
