import { Text, Card, CardProps, Image, CardSection } from "@mantine/core";
import { Fund } from "@donera/database";
import Link from "next/link";
import NextImage from "next/image";
import { FundProgress } from "@/_components/FundProgress";
import classes from "./FundCard.module.css";
import { cidToUrl } from "@/_lib/donera";
import { AddressText } from "@/_components/AddressText";

type FundCardProps = {
  fund: Fund;
  alphRaised: string;
} & CardProps;

export function FundCard({ fund, alphRaised, ...rest }: FundCardProps) {
  const { name, goal, id, organizer, metadata } = fund;
  // fallback to url
  // https://github.com/ross-weir/Donera/issues/73
  const image = cidToUrl(metadata.image?.cid) || metadata.image?.url;

  return (
    <Card radius="md" {...rest} component={Link} href={`/funds/${id}`} withBorder>
      <CardSection>
        <Image
          component={NextImage}
          src={image}
          alt="Fundraiser hero image"
          height={400}
          width={400}
          radius="md"
        />
      </CardSection>
      <Text className={classes.text} pt="sm" fz="xl" fw={540} lineClamp={1}>
        {name}
      </Text>
      <Text c="dimmed" size="xs">
        by <AddressText span address={organizer} />
      </Text>
      <FundProgress
        goal={goal}
        raised={alphRaised}
        textPosition="below"
        progressProps={{ mt: "xl", mb: "xs" }}
      />
    </Card>
  );
}
