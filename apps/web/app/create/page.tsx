import { Center, Container, Space, Title } from "@mantine/core";
import CreateFundForm from "./_components/Form";
import classes from "./page.module.css";

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
