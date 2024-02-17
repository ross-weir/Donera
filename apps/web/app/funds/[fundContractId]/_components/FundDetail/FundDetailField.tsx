import { Stack, Text, BoxProps } from "@mantine/core";

export type FundDetailFieldProps = {
  title: string;
  value: React.ReactNode;
} & BoxProps;

export function FundDetailField({ title, value, ...rest }: FundDetailFieldProps) {
  return (
    <Stack gap="xs" {...rest}>
      <Text size="sm">{title}</Text>
      {value}
    </Stack>
  );
}
