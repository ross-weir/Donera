import NextImage from "next/image";
import { Image } from "@mantine/core";
import { getPlaiceholder } from "plaiceholder";

export type ImageWithPlaceholderProps = {
  height?: any;
  width?: any;
  src: string;
};

async function imagePlaceholder(src: string) {
  const buffer = await fetch(src).then(async (res) => Buffer.from(await res.arrayBuffer()));
  const {
    metadata: { height, width },
    ...plaiceholder
  } = await getPlaiceholder(buffer, { size: 10 });

  return {
    ...plaiceholder,
    img: { src, height, width },
  };
}

// this compnent needs a lot of work to be generalized, currently just works well
// for image on fund detail page. Doesn't work well for images on search/list page
export async function ImageWithPlaceholder({ height, src }: ImageWithPlaceholderProps) {
  const { base64, img } = await imagePlaceholder(src);

  return (
    <div style={{ position: "relative", height }}>
      <Image
        radius="md"
        component={NextImage}
        src={img}
        alt="Fundraiser image"
        placeholder="blur"
        blurDataURL={base64}
        fill
        style={{
          objectFit: "contain",
        }}
      />
    </div>
  );
}
