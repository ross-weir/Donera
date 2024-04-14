"use server";

import db from "@donera/database";
import { nanoid } from "nanoid";
import { blob } from "@/_lib/server";
import { getDoneraDapp } from "@/_lib/donera";

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

export async function saveFund(formData: FormData) {
  const param = parseFormData(formData);
  const imageBuf = await param.image.arrayBuffer();
  const { url: imageUrl } = await blob.put(nanoid(10), new Blob([imageBuf]));
  const onchainMetadata = {
    name: param.name,
    description: param.description,
    imageUrl,
  };
  const { url: metadataUrl } = await blob.put(
    nanoid(10),
    new Blob([JSON.stringify(onchainMetadata)], { type: "application/json" })
  );
  const metadata = { image: { url: imageUrl } };
  const fundContractId = getDoneraDapp().deriveFundContractId({
    deadlineTimestamp: BigInt(param.deadline),
    goal: BigInt(param.goal),
    beneficiary: param.beneficiary,
    organizer: param.organizer,
    metadataUrl,
  });

  return await db.fund.create({
    data: {
      ...param,
      id: fundContractId,
      shortId: nanoid(10),
      verified: false,
      metadata,
      metadataUrl,
    },
  });
}
