import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // local testing
      {
        protocol: "https",
        hostname: "bcwg8zddhjdrrpcs.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    // https://github.com/vercel/next.js/discussions/46987
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

export default withPlaiceholder(nextConfig);
