"use client";

import { prettifyAttoAlphAmount } from "@alephium/web3";
import { Paper, PaperProps, Progress, Space, Text } from "@mantine/core";
import { DonateForm } from "./DonateForm";

export type DonateSectionProps = {
  // atto format
  goal: string;
  // atto format
  alphRaised: string;
  assetsRaised?: unknown;
} & PaperProps;

export function DonateSection({ goal, alphRaised, assetsRaised, ...rest }: DonateSectionProps) {
  const progress = Number((BigInt(alphRaised) * BigInt(100)) / BigInt(goal));

  return (
    <Paper {...rest}>
      <Text size="xl">
        {prettifyAttoAlphAmount(alphRaised)} ALPH{" "}
        <Text span c="dimmed" size="xs">
          raised of {prettifyAttoAlphAmount(goal)} target
        </Text>
      </Text>
      <Progress value={progress} color="green" />
      <Space h="md" />
      <DonateForm />
      <Space h="md" />
    </Paper>
  );
}
