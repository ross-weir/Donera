import { Alert, AlertProps } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export function UnverifiedAlert({ ...rest }: AlertProps) {
  return (
    <Alert
      variant="light"
      color="blue"
      title="This fundraiser is unverified"
      icon={<IconInfoCircle />}
      {...rest}
    >
      Your fundraiser wont be active until it is verified by Donera.
      <br /> This normally happens within a few minutes.
    </Alert>
  );
}
