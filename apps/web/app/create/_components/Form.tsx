"use client";

import { useState } from "react";
import { useWallet } from "@alephium/web3-react";
import { Anchor, Button, Group, NumberInput, Stack, TextInput, Textarea } from "@mantine/core";
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
import { ALPH_TOKEN_ID } from "@alephium/web3";
import { dynamicWalletButton } from "@/_components/Wallet/DynamicWalletButton";
import { ExtractProps } from "@/_lib/types";

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

const commonButtonProps: ExtractProps<typeof Button> = {
  miw: 120,
};

const FallbackConnectButton = dynamicWalletButton(commonButtonProps);

export default function CreateFundForm() {
  const { signer, account } = useWallet();
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
      beneficiary: isNotEmpty("Beneficiary cannot be empty"),
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSuccess = (result: CreateFundResult) => {
    notifications.show({
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

  function SetBeneficiaryText() {
    const onClick = () => {
      if (!account) {
        return;
      }
      form.setFieldValue("beneficiary", account.address);
    };

    return (
      <Anchor size="xs" onClick={onClick}>
        Set to my address
      </Anchor>
    );
  }

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
          description={<SetBeneficiaryText />}
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
