"use client";

import { prettifyAttoAlphAmount } from "@alephium/web3";
import { Paper, PaperProps, Progress, Space, Text } from "@mantine/core";
import { DonateForm } from "./DonateForm";

export type DonateSectionProps = {
  goal: bigint;
  alphRaised: bigint;
  assetsRaised?: unknown;
} & PaperProps;

export function DonateSection({ goal, alphRaised, assetsRaised, ...rest }: DonateSectionProps) {
  console.log(alphRaised);
  console.log(goal);
  // const progress = Number((BigInt(alphRaised) / BigInt(goal)) * BigInt(100));
  const progress = Number(BigInt(alphRaised) / BigInt(goal)) * 100;
  console.log(progress);

  return (
    <Paper {...rest}>
      <Text size="xl">
        {prettifyAttoAlphAmount(alphRaised)} ALPH{" "}
        <Text span c="dimmed" size="xs">
          raised of {prettifyAttoAlphAmount(goal)} target
        </Text>
      </Text>
      <Progress value={60} color="green" />
      <Space h="md" />
      <DonateForm />
      <Space h="md" />
    </Paper>
  );
}
