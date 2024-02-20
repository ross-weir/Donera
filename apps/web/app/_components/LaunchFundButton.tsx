import { ExtractProps } from "@/_lib/types";
import { Button } from "@mantine/core";
import Link from "next/link";

const defaultProps: ExtractProps<typeof Button> = {
  component: Link,
  href: "/create",
  children: "Launch fund",
};

export function LaunchFundButton(props: ExtractProps<typeof Button>) {
  return <Button {...defaultProps} {...props} />;
}
