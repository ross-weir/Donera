import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.chainsafe.io",
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
    // this can be useful to enable for hard to debug build errors
    // it will show us where an error occurred instead of displaying
    // minified stack trace files/functions
    // config.optimization = { minimize: false };
    return config;
  },
};

export default withPlaiceholder(nextConfig);
