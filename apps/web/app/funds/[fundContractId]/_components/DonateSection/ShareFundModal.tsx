"use client";

import {
  Divider,
  Input,
  Modal,
  ModalProps,
  Popover,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useClipboard, useTimeout } from "@mantine/hooks";
import { IconCopy } from "@tabler/icons-react";
import { useState } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";

function ShareLinkText({ url }: { url: string }) {
  const [popup, setPopup] = useState(false);
  const { start } = useTimeout(() => setPopup(false), 1500);
  const clipboard = useClipboard({ timeout: 500 });

  function onClick() {
    clipboard.copy(url);
    setPopup(true);
    start();
  }

  return (
    <Popover opened={popup}>
      <Popover.Target>
        <Input component="button" pointer leftSection={<IconCopy size={16} />} onClick={onClick}>
          {url}
        </Input>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="sm">Copied to clipboard</Text>
      </Popover.Dropdown>
    </Popover>
  );
}

export function ShareFundModal({ shortId, ...rest }: ModalProps & { shortId: string }) {
  const url = `${window.location.origin}/f/${shortId}`;
  const title = "Help spread the word";
  const socialButtonProps = { url };
  const socialIconProps = { round: true };
  const socials = [
    {
      name: "Facebook",
      button: FacebookShareButton,
      icon: FacebookIcon,
      props: { hashtag: "#Donera" },
    },
    {
      name: "𝕏",
      button: TwitterShareButton,
      icon: XIcon,
      props: { title, url, hashtags: ["Donera", "Alephium"] },
    },
    {
      name: "LinkedIn",
      button: LinkedinShareButton,
      icon: LinkedinIcon,
      props: { title, source: url },
    },
    {
      name: "Telegram",
      button: TelegramShareButton,
      icon: TelegramIcon,
      props: { title },
    },
    { name: "Reddit", button: RedditShareButton, icon: RedditIcon, props: { title } },
    { name: "WhatsApp", button: WhatsappShareButton, icon: WhatsappIcon, props: { title } },
  ];

  return (
    <Modal {...rest}>
      <Title order={3}>Spread the word</Title>
      <Divider my="lg" />
      <SimpleGrid cols={3}>
        {socials.map((social, idx) => (
          <Stack key={idx} align="center" gap="xs">
            <social.button {...socialButtonProps} {...social.props}>
              <social.icon {...socialIconProps} />
            </social.button>
            {social.name}
          </Stack>
        ))}
      </SimpleGrid>
      <Divider my="lg" />
      <ShareLinkText url={url} />
    </Modal>
  );
}
