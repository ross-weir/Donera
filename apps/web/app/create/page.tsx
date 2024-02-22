import { Center, Container, Space, Title } from "@mantine/core";
import CreateFundForm from "./_components/Form";
import classes from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donera - Create fundraiser",
};

export default function CreateFundPage() {
  return (
    <Container className={classes.container} size={700}>
      <Center>
        <Title order={1}>Create a fund</Title>
      </Center>
      <Space h="xl" />
      <CreateFundForm />
    </Container>
  );
}
