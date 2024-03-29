import { Button, Container, Group, Text, Title } from "@mantine/core";
import classes from "./page.module.css";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { LaunchFundButton } from "./_components/LaunchFundButton";

export default function LandingPage() {
  return (
    <Container size={700} className={classes.container}>
      <Title className={classes.title} order={1}>
        Instant{" "}
        <Text span variant="gradient" gradient={{ from: "blue", to: "cyan" }} inherit>
          crowdfunding
        </Text>{" "}
        without borders
      </Title>
      <Text className={classes.description} c="dimmed">
        Kickstart your project with confidence through a decentralized crowdfunding platform
        designed for visionaries seeking support. By utilizing the Alephium blockchain Donera
        ensures your campaign is secure, transparent, and accessible to a worldwide audience.
      </Text>

      <Group className={classes.controls} justify="flex-end">
        <Button
          component={Link}
          href="/browse"
          size="xl"
          className={classes.control}
          variant="default"
          leftSection={<IconSearch size={20} />}
        >
          Browse
        </Button>
        <LaunchFundButton
          size="xl"
          className={classes.control}
          variant="gradient"
          gradient={{ from: "blue", to: "cyan" }}
        />
      </Group>
    </Container>
  );
}
