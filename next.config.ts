import type { NextConfig } from "next";

const nextConfig = {
  typescript: {
    ignoreBuildErrors: false // workaround with slotprops data type error, in dev mode should be -> false
  },
  distDir: "build",
};

module.exports = nextConfig;

