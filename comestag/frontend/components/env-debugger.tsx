"use client";

import { useEffect } from "react";

/**
 * Debug component to check environment variables.
 * Only logs in development mode or when explicitly enabled.
 */
export default function EnvDebugger() {
  useEffect(() => {
    // Only log in development or when explicitly enabled
    const isDevelopment = process.env.NODE_ENV === "development" || 
                         process.env.NEXT_PUBLIC_DEV_MODE === "true";
    
    if (!isDevelopment) {
      return; // Don't log in production
    }
    
    // Log to console on client side only
    console.log("=== Environment Debug ===");
    console.log("NEXT_PUBLIC_DEV_MODE:", process.env.NEXT_PUBLIC_DEV_MODE);
    console.log(
      "NEXT_PUBLIC_API_BASE_URL:",
      process.env.NEXT_PUBLIC_API_BASE_URL
    );
    console.log("VERCEL_ENV:", process.env.VERCEL_ENV);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("========================");
  }, []);

  // Don't render anything to avoid hydration issues
  // Check console logs instead
  return null;
}
