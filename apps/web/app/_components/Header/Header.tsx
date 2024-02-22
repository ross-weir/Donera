import { Button, Center, Container, Group, Title } from "@mantine/core";
import Image from "next/image";
import ColorSchemeToggleIcon from "./ColorSchemeToggleIcon";
import logo from "./logo.png";
import Link from "next/link";
import { LaunchFundButton } from "../LaunchFundButton";
import classes from "./Header.module.css";
import cx from "clsx";
import { dynamicWalletIcon } from "../Wallet/DynamicWalletControl";
import { IconSearch } from "@tabler/icons-react";

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

const WalletIcon = dynamicWalletIcon(controlIconProps);

export function Header() {
  return (
    <Container size="xl" className={classes.container}>
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
          <LaunchFundButton variant="subtle">Launch fundraiser</LaunchFundButton>
          <Button
            miw={150}
            component={Link}
            href="/browse"
            style={{ border: "none" }}
            variant="default"
            leftSection={<IconSearch size={18} />}
          >
            Discover
          </Button>
          <WalletIcon {...controlIconProps} />
          <ColorSchemeToggleIcon {...controlIconProps} />
        </Group>
      </Group>
    </Container>
  );
}
