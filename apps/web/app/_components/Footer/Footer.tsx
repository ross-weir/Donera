import { ActionIcon, Anchor, Center, Group, Stack, Tooltip, rem, Text } from "@mantine/core";
import classes from "./Footer.module.css";
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import { TokenIcon } from "../TokenIcon";
import { ALPH_TOKEN_ID } from "@alephium/web3";

const socials = [
  {
    component: IconBrandGithub,
    tooltip: "Source code",
    link: "https://github.com/ross-weir/Donera",
  },
  {
    component: IconBrandX,
    tooltip: "@Ross_Weir",
    link: "https://x.com/Ross_Weir",
  },
];

const links = [
  {
    label: "Contact",
    link: "mailto:contact@rossweir.me?subject=Hello Ross",
  },
  {
    label: "Donate",
    link: "#",
  },
  {
    label: "Fees",
    link: "#",
  },
];

export function Footer() {
  const socialIcons = socials.map((s, index) => (
    <Tooltip key={index} label={s.tooltip}>
      <ActionIcon
        component="a"
        href={s.link}
        rel="noopener noreferrer"
        target="_blank"
        size="lg"
        color="gray"
        variant="subtle"
        radius="lg"
      >
        <s.component style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
      </ActionIcon>
    </Tooltip>
  ));
  const textLinks = links.map((link, index) => (
    <Anchor key={index} c="dimmed" href={link.link} lh={1} size="sm">
      {link.label}
    </Anchor>
  ));

  return (
    <Center className={classes.footer}>
      <Stack align="center">
        <Group gap={1}>{socialIcons}</Group>
        <Group>{textLinks}</Group>
        <Group gap={1}>
          <Text span c="dimmed">
            Powered by Alephium
          </Text>
          <TokenIcon size="sm" tokenId={ALPH_TOKEN_ID} />
        </Group>
      </Stack>
    </Center>
  );
}
