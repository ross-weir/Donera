import { Center, Text } from "@mantine/core";
import { IconGift } from "@tabler/icons-react";

export function EmptyPlaceholder({ text }: { text: string }) {
  return (
    <Center
      bg="var(--mantine-color-gray-light)"
      mih={400}
      styles={{ root: { textAlign: "center" } }}
    >
      <span>
        <IconGift size={32} stroke={1} />
        <Text>{text}</Text>
      </span>
    </Center>
  );
}
