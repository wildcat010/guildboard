import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  /* config options here */
  images: {
    domains: ["lavender-secret-possum-97.mypinata.cloud"],
  },
};

export default nextConfig;
