import { Center, Container, Space, Title } from "@mantine/core";
import CreateFundForm from "./_components/Form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donera - Create fundraiser",
};

export default function CreateFundPage() {
  return (
    <Container size={700}>
      <Center>
        <Title order={1}>Start a new fundraiser</Title>
      </Center>
      <Space h="xl" />
      <CreateFundForm />
    </Container>
  );
}
