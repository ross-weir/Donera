"use client";

import { Button, Popover, Text } from "@mantine/core";
import { useTimeout } from "@mantine/hooks";
import { IconLink } from "@tabler/icons-react";
import { useState } from "react";

export type ShareButtonProps = {
  // parent component is rendered on server, no window object
  shortId: string;
};

export function ShareButton({ shortId }: ShareButtonProps) {
  const [popup, setPopup] = useState(false);
  const { start } = useTimeout(() => setPopup(false), 2000);

  function onClick() {
    navigator.clipboard.writeText(`${window.location.origin}/f/${shortId}`);
    setPopup(true);
    start();
  }

  return (
    <Popover opened={popup}>
      <Popover.Target>
        <Button variant="default" fullWidth leftSection={<IconLink size={14} />} onClick={onClick}>
          Share Link
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="sm">Copied to clipboard</Text>
      </Popover.Dropdown>
    </Popover>
  );
}
