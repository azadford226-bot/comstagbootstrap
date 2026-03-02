import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // Enable dev mode for development branch by default
    // This makes NEXT_PUBLIC_DEV_MODE available at build time
    NEXT_PUBLIC_DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE || "true",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "comstag-back.onrender.com",
      },
    ],
    // Allow images from local API proxy routes
    domains: ["localhost"],
  },
};

export default nextConfig;
