import type { NextConfig } from "next";

// refer to https://github.com/nextjs/deploy-github-pages
const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: "/my-pomodoro",

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
