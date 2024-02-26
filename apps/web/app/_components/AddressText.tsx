import { Text, TextProps } from "@mantine/core";
import cx from "clsx";
import classes from "./AddressText.module.css";

export type AddressTextProps = {
  address: string;
  truncate?: boolean;
} & TextProps;

const truncatedAddress = (address: string) => {
  const start = address.slice(0, 6);
  const end = address.slice(-6);
  return `${start}...${end}`;
};

export function AddressText({ address, truncate = true, className, ...rest }: AddressTextProps) {
  return (
    <Text className={cx(classes.text, className)} {...rest}>
      {truncate ? truncatedAddress(address) : address}
    </Text>
  );
}
