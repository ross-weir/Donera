import { BoxProps, Divider, Group, Image, Stack, Text, Title } from "@mantine/core";
import { UnverifiedAlert } from "./UnverifiedAlert";
import { FundDetailField } from "./FundDetailField";
import { AlphAddressText } from "@/_components/AlphAddressText";

export type FundDetailProps = {
  name: string;
  imageSrc?: string;
  beneficiary: string;
  organizer: string;
  createdAt: string;
  deadline: string;
  description: string;
  verified: boolean;
} & BoxProps;

export function FundDetail({
  name,
  imageSrc,
  beneficiary,
  description,
  organizer,
  createdAt,
  verified,
  deadline,
  ...rest
}: FundDetailProps) {
  return (
    <Stack {...rest}>
      {!verified && <UnverifiedAlert />}
      <Group>
        <Title>{name}</Title>
      </Group>
      {/** TODO, move imageSrc to `src` */}
      {imageSrc && <Image alt="Fundraiser image" src={null} fallbackSrc={imageSrc} />}
      <Divider my="md" />
      <Group justify="space-between">
        <FundDetailField
          title="Beneficiary"
          value={<AlphAddressText address={beneficiary} size="xs" />}
        />
        <FundDetailField
          style={{ textAlign: "right" }}
          title="Created at"
          value={<Text size="xs">{createdAt}</Text>}
        />
      </Group>
      <Group justify="space-between">
        <FundDetailField
          title="Organizer"
          value={<AlphAddressText address={organizer} size="xs" />}
        />
        <FundDetailField
          style={{ textAlign: "right" }}
          title="Ends at"
          value={<Text size="xs">{deadline}</Text>}
        />
      </Group>
      <Divider my="md" />
      <Text size="lg" style={{ whiteSpace: "pre-line" }}>
        {description}
      </Text>
    </Stack>
  );
}
