import { Container, Space, Title } from "@mantine/core";
import CreateFundForm from "./_components/Form";
import classes from "./page.module.css";

export default function CreateFundPage() {
  return (
    <Container className={classes.container} size={700}>
      <Title order={1}>Create a fund</Title>
      <Space h="xl" />
      {/** handle onSubmit/onError and show notifications, etc */}
      <CreateFundForm />
    </Container>
  );
}
