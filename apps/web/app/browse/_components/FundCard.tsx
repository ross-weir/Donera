import { Text, Card, CardProps, Space, Image, CardSection, Stack } from "@mantine/core";
import { Fund } from "@donera/database";
import Link from "next/link";
import NextImage from "next/image";
import { FundProgress } from "@/_components/FundProgress";
import { AlphAddressText } from "@/_components/AlphAddressText";
import classes from "./FundCard.module.css";

type FundCardProps = {
  fund: Fund;
  alphRaised: string;
} & CardProps;

export function FundCard({ fund, alphRaised, ...rest }: FundCardProps) {
  const { name, goal, id, organizer, description, metadata } = fund;

  return (
    <Card radius="md" {...rest} component={Link} href={`/funds/${id}`}>
      <CardSection>
        <Image
          component={NextImage}
          src={metadata.image?.url}
          alt="Fundraiser hero image"
          height={300}
          width={300}
          radius="md"
        />
      </CardSection>
      <Text className={classes.text} pt="sm" fz="xl" fw={540} lineClamp={1}>
        {name}
      </Text>
      <Text c="dimmed" size="xs">
        by <AlphAddressText span address={organizer} />
      </Text>
      <Space h="sm" />
      <Stack justify="space-around">
        <Text lineClamp={4} className={classes.text}>
          {description}
        </Text>
        <Space h="sm" />
        <FundProgress
          goal={goal}
          raised={alphRaised}
          showTarget={false}
          textPosition="below"
          labelProps={{ mt: "xs" }}
        />
      </Stack>
    </Card>
  );
}
