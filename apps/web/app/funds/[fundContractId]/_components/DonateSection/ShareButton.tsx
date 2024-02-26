"use client";

import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ShareFundModal } from "./ShareFundModal";
import dynamic from "next/dynamic";

export type ShareButtonProps = {
  shortId: string;
};

const DynamicModal = dynamic(() => import("./ShareFundModal").then((m) => m.ShareFundModal), {
  ssr: false,
});

export function ShareButton({ shortId }: ShareButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <DynamicModal shortId={shortId} centered onClose={close} opened={opened} />
      <Button variant="default" fullWidth onClick={open}>
        Share
      </Button>
    </>
  );
}
