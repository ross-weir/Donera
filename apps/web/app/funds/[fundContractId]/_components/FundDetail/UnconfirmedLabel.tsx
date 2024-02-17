import { Badge, BadgeProps, Tooltip } from "@mantine/core";

export function UnconfirmedLabel({ size, color, ...rest }: BadgeProps) {
  return (
    <Tooltip label="This fund has yet to be confirmed on the blockchain. Donations can't be accepted yet.">
      <Badge color={color || "red"} size={size || "xs"} {...rest}>
        Unconfirmed
      </Badge>
    </Tooltip>
  );
}
