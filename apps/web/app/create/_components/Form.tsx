"use client";

import { useState } from "react";
import { useWallet } from "@alephium/web3-react";
import {
  Anchor,
  Button,
  Group,
  NumberInput,
  Popover,
  Stack,
  TextInput,
  Textarea,
  Text,
  FileInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm, isNotEmpty, hasLength, isInRange } from "@mantine/form";
import { getDoneraDapp, getExternalLinkForTx } from "@/_lib/donera";
import dayjs from "dayjs";
import Link from "next/link";
import { saveFund } from "../_actions/mutations";
import { CreateFundResult } from "@donera/dapp";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconExternalLink } from "@tabler/icons-react";
import { handleTxSubmitError } from "@/_components/TxErrorNotification";
import { TokenIcon } from "@/_components/TokenIcon";
import { ALPH_TOKEN_ID, validateAddress } from "@alephium/web3";
import { dynamicWalletButton } from "@/_components/Wallet/DynamicWalletControl";
import { ExtractProps } from "@/_lib/types";
import { useTimeout } from "@mantine/hooks";
import { useRouter } from "next/navigation";

interface FormSchema {
  name: string;
  description: string;
  goal: number;
  deadline: Date;
  beneficiary: string;
  image?: File;
}

function validDeadline(date: Date): boolean {
  const submitted = dayjs(date);

  return submitted.isAfter(dayjs()) && submitted.isBefore(dayjs().add(3, "months"));
}

function validBeneficiary(value: string): boolean {
  try {
    validateAddress(value);
  } catch (e: unknown) {
    return false;
  }
  return true;
}
const IMAGE_MIME_TYPES = [
  "image/png",
  "image/gif",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
  "image/avif",
];
function validImage(value?: File): string | null {
  if (!value) {
    return "Fundraisers must include a image";
  }
  if (!value.type) {
    return "Invalid filetype";
  }
  if (value.size > 4.5 * 1024 ** 2) {
    return "Images must be less than 4.5mb";
  }
  return null;
}

const commonButtonProps: ExtractProps<typeof Button> = {
  miw: 120,
};

const FallbackConnectButton = dynamicWalletButton(commonButtonProps);

function SetBeneficiaryText({ form }: { form: any }) {
  const [popup, setPopup] = useState(false);
  const { start } = useTimeout(() => setPopup(false), 2000);
  const { account } = useWallet();

  const onClick = () => {
    if (!account) {
      start();
      setPopup(true);
      return;
    }
    form.setFieldValue("beneficiary", account.address);
  };

  return (
    <Popover withArrow disabled={!!account} opened={popup}>
      <Popover.Target>
        <Anchor size="xs" onClick={onClick}>
          Set to my address
        </Anchor>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="sm">Connect your wallet first</Text>
      </Popover.Dropdown>
    </Popover>
  );
}

export default function CreateFundForm() {
  const router = useRouter();
  const { signer } = useWallet();
  const form = useForm<FormSchema>({
    initialValues: {
      name: "",
      description: "",
      goal: 0,
      deadline: dayjs().add(1, "day").toDate(),
      beneficiary: "",
      image: undefined,
    },
    validate: {
      name: isNotEmpty("Name cannot be empty"),
      description: hasLength({ min: 1 }, "You must provide a description"),
      goal: isInRange({ min: 1 }, "Goal must be 1 or more"),
      deadline: (value: Date) =>
        !validDeadline(value) ? "Deadline must be within the next 3 months" : null,
      beneficiary: (value) => (!validBeneficiary(value) ? "Invalid Alephium address" : null),
      image: (value) => validImage(value),
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commonInputProps = { disabled: isSubmitting, required: true, withAsterisk: true };

  const onSuccess = async (result: CreateFundResult) => {
    notifications.show({
      withBorder: true,
      color: "teal",
      icon: <IconCheck size="1.1rem" />,
      title: "Fund submitted",
      message: (
        <span>
          View your transaction on the explorer{" "}
          <Anchor href={getExternalLinkForTx(result.txId)} target="_blank" rel="noreferrer">
            <IconExternalLink size={12} />.
          </Anchor>
        </span>
      ),
    });
    const formData = new FormData();
    const { deadline, ...rest } = result;
    for (const [key, value] of Object.entries(rest)) {
      formData.set(key, value);
    }
    formData.set("deadline", deadline.toISOString());
    formData.set("image", form.values.image!);
    const response = await fetch("/funds", {
      method: "POST",
      body: formData,
    });
    const { id } = await response.json();
    router.push(`/funds/${id}`);
    // saveFund(result, formData).catch(onError);
  };

  const onError = (e: Error) => {
    // only set isSubmitting on error
    // so the loading state stays until the backend redirects the client
    // in the `saveFund` function
    setIsSubmitting(false);
    handleTxSubmitError(e, "Fund creation");
  };

  const onSubmit = async (form: FormSchema) => {
    setIsSubmitting(true);
    getDoneraDapp().createFund(signer!, form).then(onSuccess).catch(onError);
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Name"
          description="The name of your fund raiser"
          {...commonInputProps}
          {...form.getInputProps("name")}
        />
        <FileInput
          label="Upload image"
          description="Upload a image that will be shown on the fundraisers page. 4.5mb max size limit."
          placeholder="Fundraiser image"
          accept={IMAGE_MIME_TYPES.join(",")}
          clearable
          multiple={false}
          {...commonInputProps}
          {...form.getInputProps("image")}
        />
        <Textarea
          label="Description"
          description="Describe the reason for creating the fund"
          autosize
          minRows={8}
          maxRows={8}
          {...commonInputProps}
          {...form.getInputProps("description")}
        />
        <NumberInput
          label="Goal"
          description="The amount of ALPH you are aiming to raise"
          hideControls
          leftSection={<TokenIcon size="sm" tokenId={ALPH_TOKEN_ID} />}
          decimalScale={2}
          {...commonInputProps}
          {...form.getInputProps("goal")}
        />
        <DateTimePicker
          label="Deadline"
          clearable
          description="The end time for the fundraiser"
          {...commonInputProps}
          {...form.getInputProps("deadline")}
        />
        <TextInput
          label="Beneficiary"
          description={<SetBeneficiaryText form={form} />}
          placeholder="Beneficiaries address"
          {...commonInputProps}
          {...form.getInputProps("beneficiary")}
        />
        <Group justify="flex-end">
          <Link href="/">
            <Button {...commonButtonProps} variant="default">
              Cancel
            </Button>
          </Link>
          <FallbackConnectButton {...commonButtonProps}>
            <Button type="submit" {...commonButtonProps} disabled={!signer} loading={isSubmitting}>
              Create
            </Button>
          </FallbackConnectButton>
        </Group>
      </Stack>
    </form>
  );
}
