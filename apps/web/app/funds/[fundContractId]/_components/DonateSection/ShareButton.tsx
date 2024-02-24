"use client";

import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ShareFundModal } from "./ShareFundModal";

export type ShareButtonProps = {
  shortId: string;
};

export function ShareButton({ shortId }: ShareButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ShareFundModal shortId={shortId} centered onClose={close} opened={opened} />
      <Button variant="default" fullWidth onClick={open}>
        Share
      </Button>
    </>
  );
}
