"use client";

import { useState } from "react";
import { useWallet } from "@alephium/web3-react";
import { Button, Group, NumberInput, Stack, TextInput, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm, isNotEmpty, hasLength, isInRange } from "@mantine/form";
import { getDoneraDapp } from "../../_donera";
import dayjs from "dayjs";
import Link from "next/link";

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

interface CreateFundFormProps {
  onSubmittedTx: (txId: string) => Promise<void>;
}

export default function CreateFundForm({ onSubmittedTx }: CreateFundFormProps) {
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
      description: hasLength(
        { min: 0, max: 800 },
        "Description must be between 0 - 800 characters"
      ),
      goal: isInRange({ min: 1 }, "Goal must be 1 or more"),
      deadline: (value: Date) => (!dateIsInFuture(value) ? "Deadline must be in the future" : null),
      beneficiary: isNotEmpty("Beneficiary cannot be empty"),
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signer } = useWallet();

  const onSubmit = async (form: FormSchema) => {
    setIsSubmitting(true);
    getDoneraDapp()
      .createFund(signer!, form)
      .then(onSubmittedTx)
      .catch(console.error)
      .finally(() => setIsSubmitting(false));
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput label="Name" withAsterisk {...form.getInputProps("name")} />
        <Textarea
          label="Description"
          description="Describe the reason for creating the fund"
          withAsterisk
          {...form.getInputProps("description")}
        />
        <NumberInput
          label="Goal"
          description="The amount of ALPH you are aiming to raise"
          withAsterisk
          {...form.getInputProps("goal")}
        />
        <DateTimePicker
          label="Deadline"
          withAsterisk
          description="The end time for the fundraiser"
          {...form.getInputProps("deadline")}
        />
        <TextInput
          label="Beneficiary"
          withAsterisk
          description="The address of the beneficiary receiving and finializing the fund"
          {...form.getInputProps("beneficiary")}
        />
        <Group justify="flex-end">
          <Link href="/">
            <Button variant="default">Cancel</Button>
          </Link>
          <Button type="submit" disabled={!signer} loading={isSubmitting}>
            Create
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
