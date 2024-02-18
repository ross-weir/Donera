"use client";

import { Title, Paper, PaperProps, Space } from "@mantine/core";
import { DonateForm } from "./DonateForm";
import { FundProgress } from "@/_components/FundProgress";

export type DonateSectionProps = {
  fundContractId: string;
  // atto format
  goal: string;
  // atto format
  alphRaised: string;
  assetsRaised?: unknown;
} & PaperProps;

export function DonateSection({
  fundContractId,
  goal,
  alphRaised,
  assetsRaised,
  ...rest
}: DonateSectionProps) {
  return (
    <Paper {...rest}>
      <FundProgress goal={goal} raised={alphRaised} labelProps={{ size: "xl" }} />
      <Space h="md" />
      <Title order={4}>Make a donation</Title>
      <Space h="md" />
      <DonateForm fundContractId={fundContractId} />
    </Paper>
  );
}
