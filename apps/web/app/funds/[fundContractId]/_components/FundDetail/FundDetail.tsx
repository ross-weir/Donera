import { BoxProps, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { UnverifiedAlert } from "./UnverifiedAlert";
import { FundDetailField } from "./FundDetailField";
import { AlphAddressText } from "@/_components/AlphAddressText";
import cx from "clsx";
import classes from "./FundDetail.module.css";

export type FundDetailProps = {
  name: string;
  image: React.ReactNode;
  beneficiary: string;
  organizer: string;
  createdAt: string;
  deadline: string;
  description: string;
  verified: boolean;
} & BoxProps;

export function FundDetail({
  name,
  image,
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
        <Title className={classes.text}>{name}</Title>
      </Group>
      {image}
      <Divider my="md" />
      <Group justify="space-between">
        <FundDetailField
          title="Beneficiary"
          value={<AlphAddressText address={beneficiary} size="xs" />}
        />
        <FundDetailField
          className={classes.fundDetailRight}
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
          className={classes.fundDetailRight}
          title="Ends at"
          value={<Text size="xs">{deadline}</Text>}
        />
      </Group>
      <Divider my="md" />
      <Text className={cx(classes.description, classes.text)}>{description}</Text>
    </Stack>
  );
}
