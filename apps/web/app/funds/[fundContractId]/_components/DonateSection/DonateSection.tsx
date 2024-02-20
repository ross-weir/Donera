import { Title, Paper, PaperProps, Space, Divider, ThemeIcon, Text } from "@mantine/core";
import { DonateForm } from "./DonateForm";
import { FundProgress } from "@/_components/FundProgress";
import { IconCheck, IconLink } from "@tabler/icons-react";
import { ShareButton } from "./ShareButton";
import { Donation } from "@donera/database";
import { LatestDonationSection } from "./LatestDonationSection";

type SimpleDonation = Omit<Donation, "fundId">;

export type DonateSectionProps = {
  fundContractId: string;
  shortId: string;
  // atto format
  goal: string;
  // atto format
  alphRaised: string;
  assetsRaised?: unknown;
  latestDonations: SimpleDonation[];
  donationCount: number;
} & PaperProps;

export function DonateSection({
  fundContractId,
  shortId,
  goal,
  alphRaised,
  assetsRaised,
  latestDonations,
  donationCount,
  ...rest
}: DonateSectionProps) {
  return (
    <Paper {...rest}>
      <FundProgress goal={goal} raised={alphRaised} labelProps={{ size: "xl" }} />
      <Text pt="xs" size="sm">
        {donationCount} donation{donationCount > 1 ? "s" : ""}
      </Text>
      <Space h="md" />
      <Title order={4}>Make a donation</Title>
      <Space h="md" />
      <DonateForm fundContractId={fundContractId} />
      <ShareButton
        shortId={shortId}
        commonProps={{ variant: "default", fullWidth: true }}
        clickedProps={{
          leftSection: (
            <ThemeIcon radius="xl" color="green" size={14}>
              <IconCheck size={14} />
            </ThemeIcon>
          ),
        }}
        clickedText="Copied to clipboard"
        defaultProps={{ leftSection: <IconLink size={14} /> }}
        defaultText="Share link"
      />
      <Divider my="lg" />
      <LatestDonationSection donations={latestDonations} />
    </Paper>
  );
}
