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
      Your fundraiser wont be searchable until it is verified by Donera. This normally happens
      within a few minutes. Make a coffee and check back soon.
    </Alert>
  );
}
