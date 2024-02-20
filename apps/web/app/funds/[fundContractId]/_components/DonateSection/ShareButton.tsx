"use client";

import { Button, ButtonProps, ElementProps } from "@mantine/core";
import { useTimeout } from "@mantine/hooks";
import { useState } from "react";

type BaseProps = ElementProps<"button"> & ButtonProps;

export type ShareButtonProps = {
  shortId: string;
  commonProps: BaseProps;
  clickedProps: BaseProps;
  defaultProps: BaseProps;
  defaultText: string;
  clickedText: string;
};

export function ShareButton({
  shortId,
  commonProps,
  clickedProps,
  defaultProps,
  defaultText,
  clickedText,
}: ShareButtonProps) {
  const [activeClick, setActiveClick] = useState(false);
  const { start } = useTimeout(() => setActiveClick(false), 2000);

  function onClick() {
    navigator.clipboard.writeText(`${window.location.origin}/f/${shortId}`);
    setActiveClick(true);
    start();
  }

  return activeClick ? (
    <Button {...commonProps} {...clickedProps}>
      {clickedText}
    </Button>
  ) : (
    <Button {...commonProps} {...defaultProps} onClick={onClick}>
      {defaultText}
    </Button>
  );
}
