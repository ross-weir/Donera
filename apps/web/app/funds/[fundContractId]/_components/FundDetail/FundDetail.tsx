import { BoxProps, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { UnverifiedAlert } from "./UnverifiedAlert";
import { FundDetailField } from "./FundDetailField";
import { AlphAddressText } from "@/_components/AlphAddressText";
import cx from "clsx";
import classes from "./FundDetail.module.css";
import { Fund } from "@donera/database";
import { addressFromContractId } from "@alephium/web3";

export type FundDetailProps = {
  fund: Fund;
  image: React.ReactNode;
} & BoxProps;

export function FundDetail({ fund, image, ...rest }: FundDetailProps) {
  const { name, description, beneficiary, organizer, createdAt, verified, deadline, id } = fund;
  const contractAddress = addressFromContractId(id);

  return (
    <Stack {...rest}>
      {!verified && <UnverifiedAlert />}
      <Stack gap={1}>
        <Title className={classes.text}>{name}</Title>
        <Group gap={2}>
          <Text size="xs" style={{ fontFamily: "var(--donera-address-font-family)" }}>
            Contract:{" "}
          </Text>
          <AlphAddressText address={contractAddress} size="xs" />
        </Group>
      </Stack>
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
          value={<Text size="xs">{createdAt.toLocaleString()}</Text>}
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
          value={<Text size="xs">{deadline.toLocaleString()}</Text>}
        />
      </Group>
      <Divider my="md" />
      <Text className={cx(classes.description, classes.text)}>{description}</Text>
    </Stack>
  );
}
