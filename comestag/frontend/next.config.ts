import type { NextConfig } from "next";

// Check if we're building for static export
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  /* config options here */
  // Use standalone mode - we'll serve the HTML files manually
  // Static export has too many limitations with App Router
  // Temporarily disabled due to Windows symlink permission issues
  // output: "standalone",
  // Disable image optimization for static serving
  images: {
    unoptimized: true,
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
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
  },
  env: {
    // Dev mode configuration:
    // - In development (NODE_ENV !== 'production'), defaults to "true" for local dev
    // - In production builds, defaults to "false" for safety
    // - Can be explicitly overridden by NEXT_PUBLIC_DEV_MODE environment variable
    // - Production deployments should explicitly set NEXT_PUBLIC_DEV_MODE=false
    NEXT_PUBLIC_DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE !== undefined && process.env.NEXT_PUBLIC_DEV_MODE !== ""
      ? process.env.NEXT_PUBLIC_DEV_MODE
      : process.env.NODE_ENV !== "production"
      ? "true" // Auto-enable in development
      : "false", // Safe default for production
    // Use empty string for relative paths when frontend and backend are on same origin
    // Set via environment variable in production if different origin
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  },
  // For static export compatibility
  trailingSlash: false,
};

export default nextConfig;
