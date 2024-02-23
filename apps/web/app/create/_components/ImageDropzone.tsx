"use client";
import { Group, rem, Text } from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";

// max size supported by vercel functions
const MAX_SIZE = 4.5 * 1024 ** 2;

export function ImageDropzone(props: DropzoneProps) {
  return (
    <Dropzone {...props} multiple={false} accept={IMAGE_MIME_TYPE} maxSize={MAX_SIZE} mih={220}>
      <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
        <Dropzone.Accept>
          <IconUpload
            style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-blue-6)" }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag image here or click to select the image
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Images can not exceed 4.5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
