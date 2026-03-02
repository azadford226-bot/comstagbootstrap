"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Conditionally render Vercel Analytics and Speed Insights
 * Only enable when running on Vercel (VERCEL_ENV is set)
 */
export default function VercelAnalytics() {
  // Only render on Vercel
  const isVercel = process.env.VERCEL_ENV !== undefined;

  if (!isVercel) {
    return null;
  }

  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
