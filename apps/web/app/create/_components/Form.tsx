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

interface FormSchema {
  name: string;
  description: string;
  goal: number;
  deadline: Date;
  beneficiary: string;
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
  const { signer } = useWallet();
  const form = useForm<FormSchema>({
    initialValues: {
      name: "",
      description: "",
      goal: 0,
      deadline: dayjs().add(1, "day").toDate(),
      beneficiary: "",
    },
    validate: {
      name: isNotEmpty("Name cannot be empty"),
      description: hasLength({ min: 1 }, "You must provide a description"),
      goal: isInRange({ min: 1 }, "Goal must be 1 or more"),
      deadline: (value: Date) =>
        !validDeadline(value) ? "Deadline must be within the next 3 months" : null,
      beneficiary: (value) => (!validBeneficiary(value) ? "Invalid Alephium address" : null),
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSuccess = (result: CreateFundResult) => {
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
    saveFund(result).catch(onError);
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
          withAsterisk
          required
          {...form.getInputProps("name")}
        />
        <Textarea
          label="Description"
          description="Describe the reason for creating the fund"
          withAsterisk
          required
          autosize
          minRows={8}
          maxRows={8}
          {...form.getInputProps("description")}
        />
        <NumberInput
          label="Goal"
          description="The amount of ALPH you are aiming to raise"
          withAsterisk
          required
          hideControls
          leftSection={<TokenIcon size="sm" tokenId={ALPH_TOKEN_ID} />}
          decimalScale={2}
          {...form.getInputProps("goal")}
        />
        <DateTimePicker
          label="Deadline"
          withAsterisk
          required
          clearable
          description="The end time for the fundraiser"
          {...form.getInputProps("deadline")}
        />
        <TextInput
          label="Beneficiary"
          withAsterisk
          required
          description={<SetBeneficiaryText form={form} />}
          placeholder="Beneficiaries address"
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
