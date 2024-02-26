"use client";
import { CopyButton, Group, TextProps } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";
import { AddressText } from "./AddressText";

export type AddressCopyTextProps = {
  address: string;
  truncate?: boolean;
} & TextProps;

function CopyIcon({ copied }: { copied: boolean }) {
  return copied ? <IconCheck size={14} /> : <IconCopy size={14} />;
}

export function AddressCopyText({ address, truncate = true, ...rest }: AddressCopyTextProps) {
  const { hovered, ref } = useHover();

  return (
    <CopyButton value={address} timeout={2000}>
      {({ copied, copy }) => (
        <Group ref={ref} gap={6} onClick={copy}>
          <AddressText
            td={hovered ? "underline" : undefined}
            style={{ cursor: "pointer" }}
            address={address}
            truncate={truncate}
            {...rest}
          />
          {(hovered || copied) && <CopyIcon copied={copied} />}
        </Group>
      )}
    </CopyButton>
  );
}
