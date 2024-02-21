"use client";

import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from "@mantine/core";
import { IconSun, IconMoon, TablerIconsProps } from "@tabler/icons-react";
import cx from "clsx";
import classes from "./ColorSchemeToggleIcon.module.css";
import { ExtractProps } from "@/_lib/types";

export type ColorSchemeToggleIconProps = {
  actionProps: ExtractProps<typeof ActionIcon>;
  iconProps: TablerIconsProps;
};

export default function ColorSchemeToggleIcon({
  actionProps,
  iconProps,
}: ColorSchemeToggleIconProps) {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });
  const { className, ...restIcon } = iconProps;

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
      {...actionProps}
      aria-label="Toggle color scheme"
    >
      <IconSun {...restIcon} className={cx(className, classes.light)} />
      <IconMoon {...restIcon} className={cx(className, classes.dark)} />
    </ActionIcon>
  );
}
