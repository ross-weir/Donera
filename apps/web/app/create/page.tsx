import { Space, Title } from "@mantine/core";
import CreateFundForm from "./_components/Form";

export default function CreateFundPage() {
  return (
    <>
      <Title order={1}>Create a fund</Title>
      <Space h="xl" />
      {/** handle onSubmit/onError and show notifications, etc */}
      <CreateFundForm />
    </>
  );
}
