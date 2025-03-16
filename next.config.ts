// import type { NextConfig } from "next";

module.exports = {
 distDir: "build",

  eslint: {
    ignoreDuringBuilds: true,
    reactStrictMode: true,

  },
}

// const nextConfig = {
//   typescript: {
//    // ignoreBuildErrors: false // workaround with slotprops data type error, in dev mode should be -> false
//   },
//   distDir: "build",
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// };

// module.exports = nextConfig;

