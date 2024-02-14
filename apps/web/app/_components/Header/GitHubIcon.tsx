"use client";

import { ActionIcon, Tooltip } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";

export default function GitHubIcon() {
  return (
    <Tooltip label="Source Code">
      <ActionIcon
        component="a"
        href="https://github.com/ross-weir/Donera"
        target="_blank"
        rel="noopener noreferrer"
        variant="default"
        size="lg"
        aria-label="Link to GitHub repository"
      >
        <IconBrandGithub stroke={1.5} />
      </ActionIcon>
    </Tooltip>
  );
}
