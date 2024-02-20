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
import { handleTxSubmitError } from "@/_lib/client";

interface FormSchema {
  name: string;
  description: string;
  goal: number;
  deadline: Date;
  beneficiary: string;
}

function dateIsInFuture(date: Date): boolean {
  return date > new Date();
}

export default function CreateFundForm() {
  const { signer, account } = useWallet();
  const creatorAddress = account?.address ?? "";
  const form = useForm<FormSchema>({
    initialValues: {
      name: "",
      description: "",
      goal: 0,
      deadline: dayjs().add(1, "day").toDate(),
      beneficiary: creatorAddress,
    },
    validate: {
      name: isNotEmpty("Name cannot be empty"),
      description: hasLength({ min: 1 }, "You must provide a description"),
      goal: isInRange({ min: 1 }, "Goal must be 1 or more"),
      deadline: (value: Date) => (!dateIsInFuture(value) ? "Deadline must be in the future" : null),
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
    saveFund(result);
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
          {...form.getInputProps("description")}
        />
        <NumberInput
          label="Goal"
          description="The amount of ALPH you are aiming to raise"
          withAsterisk
          required
          hideControls
          decimalScale={2}
          {...form.getInputProps("goal")}
        />
        <DateTimePicker
          label="Deadline"
          withAsterisk
          required
          description="The end time for the fundraiser"
          {...form.getInputProps("deadline")}
        />
        <TextInput
          label="Beneficiary"
          withAsterisk
          required
          description="The address of the beneficiary receiving the funds"
          {...form.getInputProps("beneficiary")}
        />
        <Group justify="flex-end">
          <Link href="/">
            <Button miw={120} variant="default">
              Cancel
            </Button>
          </Link>
          <Button type="submit" miw={120} disabled={!signer} loading={isSubmitting}>
            Create
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
