import { Title, Paper, PaperProps, Space, Divider, Text } from "@mantine/core";
import { DonateForm } from "./DonateForm";
import { FundProgress } from "@/_components/FundProgress";
import { ShareButton } from "./ShareButton";
import { Donation } from "@donera/database";
import { LatestDonationSection } from "./LatestDonationSection";

type SimpleDonation = Omit<Donation, "fundId" | "createdAt">;

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
  verified: boolean;
} & PaperProps;

export function DonateSection({
  fundContractId,
  shortId,
  goal,
  alphRaised,
  assetsRaised,
  latestDonations,
  donationCount,
  verified,
  ...rest
}: DonateSectionProps) {
  return (
    <Paper {...rest}>
      <FundProgress goal={goal} raised={alphRaised} labelProps={{ size: "xl" }} />
      <Text pt="xs" size="sm">
        {donationCount} donation{donationCount === 1 ? "" : "s"}
      </Text>
      <Space h="md" />
      <Title order={4}>Make a donation</Title>
      <Space h="md" />
      <DonateForm fundContractId={fundContractId} disabled={!verified} />
      <ShareButton shortId={shortId} />
      <Divider my="lg" />
      <LatestDonationSection donations={latestDonations} />
    </Paper>
  );
}
