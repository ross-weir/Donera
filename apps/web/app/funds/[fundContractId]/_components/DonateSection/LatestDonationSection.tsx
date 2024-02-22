import { AlphAddressText } from "@/_components/AlphAddressText";
import { TokenIcon } from "@/_components/TokenIcon";
import { TokenValueText } from "@/_components/TokenValueText";
import { Donation } from "@donera/database";
import { Box, BoxComponentProps, List, ListItem, Space, Title, Text, Center } from "@mantine/core";
import { IconGift } from "@tabler/icons-react";

type SimpleDonation = Omit<Donation, "fundId" | "createdAt">;

export type LatestDonationSectionProps = {
  donations: SimpleDonation[];
} & BoxComponentProps;

type DonationTextProps = {
  amount: string;
  tokenId: string;
  donor: string;
};

function DonationText({ amount, tokenId, donor }: DonationTextProps) {
  return (
    <>
      <Text pt="sm">
        <TokenValueText span tokenId={tokenId} amount={amount} useCurrencySymbol={false} /> donated
      </Text>
      <Text c="dimmed" size="xs">
        by <AlphAddressText size="sm" span address={donor} />
      </Text>
    </>
  );
}

function DonationList({ donations }: { donations: SimpleDonation[] }) {
  return (
    <List spacing="xl">
      {donations.map((donation) => (
        <ListItem key={donation.id} icon={<TokenIcon tokenId={donation.tokenId} showNamePopup />}>
          <DonationText {...donation} />
        </ListItem>
      ))}
    </List>
  );
}

function NoDonation() {
  return (
    <Center
      bg="var(--mantine-color-gray-light)"
      mih={100}
      styles={{ root: { textAlign: "center" } }}
    >
      <span>
        <IconGift size={32} stroke={1} />
        <Text>No donations received</Text>
      </span>
    </Center>
  );
}

export function LatestDonationSection({ donations, ...rest }: LatestDonationSectionProps) {
  return (
    <Box {...rest}>
      <Title fz="xl" fw={540}>
        Latest donations
      </Title>
      <Space my="lg" />
      {donations.length ? <DonationList donations={donations} /> : <NoDonation />}
    </Box>
  );
}
