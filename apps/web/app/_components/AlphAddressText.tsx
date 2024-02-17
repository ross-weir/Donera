import { Anchor, Text, TextProps, Tooltip } from "@mantine/core";
import classes from "./AlphAddressText.module.css";
import {} from "@alephium/web3-react";

export type AlphAddressTextProps = {
  address: string;
  truncate?: boolean;
  showTooltip?: boolean;
  explorerLink?: string;
} & TextProps;

const truncatedAddress = (address: string) => {
  const start = address.slice(0, 6);
  const end = address.slice(-6);
  return `${start}...${end}`;
};

export function AlphAddressText({
  address,
  explorerLink,
  truncate = true,
  showTooltip = true,
  ...rest
}: AlphAddressTextProps) {
  let text = (
    <Text className={classes.text} {...rest}>
      {truncate ? truncatedAddress(address) : address}
    </Text>
  );

  if (explorerLink) {
    text = (
      <Anchor href={explorerLink} target="_blank" underline="hover">
        {text}
      </Anchor>
    );
  }

  if (showTooltip) {
    text = <Tooltip label={address}>{text}</Tooltip>;
  }

  return text;
}
