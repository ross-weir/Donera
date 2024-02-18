import { Text, Card, CardProps, Space, Image, CardSection } from "@mantine/core";
import { Fund } from "@donera/database";
import Link from "next/link";
import { FundProgress } from "@/_components/FundProgress";
import { AlphAddressText } from "@/_components/AlphAddressText";

type FundCardProps = {
  fund: Fund;
  alphRaised: string;
} & CardProps;

export function FundCard({ fund, alphRaised, ...rest }: FundCardProps) {
  const { name, goal, fundContractId, creationTx } = fund;

  return (
    <Card {...rest} component={Link} href={`/funds/${fundContractId}`}>
      <CardSection>
        <Image
          src="https://placehold.co/900x400?text=Placeholder"
          alt="Running challenge"
          height={150}
        />
      </CardSection>
      <Text pt="sm" fz="xl" fw={540}>
        {name}
      </Text>
      <Text c="dimmed" size="xs">
        by <AlphAddressText span address={creationTx.signerAddress} />
      </Text>
      <Space h="sm" />
      <FundProgress
        goal={goal}
        raised={alphRaised}
        showTarget={false}
        textPosition="below"
        labelProps={{ mt: "xs" }}
      />
    </Card>
  );
}
