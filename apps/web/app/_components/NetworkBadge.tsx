import { NetworkId } from "@alephium/web3";
import { Badge, BadgeProps, DefaultMantineColor } from "@mantine/core";

export type NetworkBadgeProps = {
  value: string;
} & BadgeProps;

const badgeColor: Record<NetworkId, DefaultMantineColor> = {
  mainnet: "yellow",
  testnet: "lime",
  devnet: "red",
};

export function NetworkBadge({ value, ...rest }: NetworkBadgeProps) {
  const color: DefaultMantineColor = badgeColor[value as NetworkId] ?? "gray";

  return (
    <Badge autoContrast color={color} {...rest}>
      {value}
    </Badge>
  );
}
