"use client";

import { useEffect } from "react";
import { initDevAuth, isDevMode } from "@/lib/dev-auth";

/**
 * DevModeInitializer
 *
 * This component initializes mock authentication when NEXT_PUBLIC_DEV_MODE=true.
 * Add it to your root layout to enable dev mode across the app.
 */
export default function DevModeInitializer() {
  useEffect(() => {
    // Extra safety check: Never run in Vercel production
    const isVercelProduction = process.env.VERCEL_ENV === "production";
    
    if (isVercelProduction && isDevMode()) {
      console.error(
        "🚨 SECURITY WARNING: Dev mode is enabled in production! " +
        "Remove NEXT_PUBLIC_DEV_MODE from production environment variables."
      );
      return;
    }

    if (isDevMode()) {
      initDevAuth();
    }
  }, []);

  // Show a subtle indicator when dev mode is active
  if (!isDevMode()) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-yellow-500 text-black px-3 py-1 rounded-md text-xs font-mono shadow-lg">
      🔧 DEV MODE
    </div>
  );
}
