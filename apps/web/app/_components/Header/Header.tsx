import { Group, Title } from "@mantine/core";
import Image from "next/image";
import ColorSchemeToggleIcon from "./ColorSchemeToggleIcon";
import logo from "./logo.png";
import Link from "next/link";
import { LaunchFundButton } from "../LaunchFundButton";
import { SearchBar } from "./SearchBar";
import classes from "./Header.module.css";
import WalletIcon from "./WalletIcon";
import cx from "clsx";

const controlIconProps = {
  iconProps: {
    className: cx(classes.icon),
    stroke: 1.5,
  },
  actionProps: {
    variant: "default",
    size: "lg",
  },
};

export function Header() {
  return (
    <Group className={classes.container} justify="space-between">
      <Group>
        <Link href="/" className={classes.logoLink}>
          <Group>
            <Image src={logo} alt="Donera Logo" width={32} height={32} />
            <Title order={2}>Donera</Title>
          </Group>
        </Link>
      </Group>
      <Group>
        <LaunchFundButton style={{ border: "none" }} variant="default">
          Launch fundraiser
        </LaunchFundButton>
        <SearchBar />
        <WalletIcon {...controlIconProps} />
        <ColorSchemeToggleIcon {...controlIconProps} />
      </Group>
    </Group>
  );
}
