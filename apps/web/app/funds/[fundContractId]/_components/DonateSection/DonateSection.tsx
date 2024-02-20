"use client";

import { Title, Paper, PaperProps, Space, Button } from "@mantine/core";
import { DonateForm } from "./DonateForm";
import { FundProgress } from "@/_components/FundProgress";
import { IconCheck, IconLink } from "@tabler/icons-react";
import { useTimeout } from "@mantine/hooks";
import { useState } from "react";

export type DonateSectionProps = {
  fundContractId: string;
  shortId: string;
  // atto format
  goal: string;
  // atto format
  alphRaised: string;
  assetsRaised?: unknown;
} & PaperProps;

export function DonateSection({
  fundContractId,
  shortId,
  goal,
  alphRaised,
  assetsRaised,
  ...rest
}: DonateSectionProps) {
  const [shareClicked, setShareClicked] = useState(false);
  const { start } = useTimeout(onClickTimeout, 2000);

  function onClickTimeout() {
    setShareClicked(false);
  }

  function onShareClick() {
    navigator.clipboard.writeText(`${window.location.origin}/f/${shortId}`);
    setShareClicked(true);
    start();
  }

  return (
    <Paper {...rest}>
      <FundProgress goal={goal} raised={alphRaised} labelProps={{ size: "xl" }} />
      <Space h="md" />
      <Title order={4}>Make a donation</Title>
      <Space h="md" />
      <DonateForm fundContractId={fundContractId} />
      {shareClicked ? (
        <Button variant="default" fullWidth leftSection={<IconCheck size={14} color="green" />}>
          Copied to clipboard
        </Button>
      ) : (
        <Button
          variant="default"
          fullWidth
          leftSection={<IconLink size={14} />}
          onClick={onShareClick}
        >
          Share
        </Button>
      )}
    </Paper>
  );
}
