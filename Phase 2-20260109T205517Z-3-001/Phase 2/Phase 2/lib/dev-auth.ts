/**
 * Development Authentication Mock
 *
 * This utility provides a mock authentication system for development/testing.
 * Set NEXT_PUBLIC_DEV_MODE=true in your .env.local to enable it.
 *
 * WARNING: Never use this in production!
 */

import {
  setAccessToken,
  setRefreshToken,
  setUserEmail,
  setUserName,
  setUserType,
  getAccessToken,
  clearAllAuthData,
} from "@/lib/secure-storage";

// Dev mode enabled when:
// 1. NEXT_PUBLIC_DEV_MODE is explicitly set to "true"
// 2. We're NOT in a Vercel production deployment (VERCEL_ENV !== 'production')
// Note: Works in preview/development deployments and local development
const isDevelopment =
  process.env.NEXT_PUBLIC_DEV_MODE === "true" &&
  (process.env.VERCEL_ENV !== "production" || !process.env.VERCEL_ENV);

// Mock tokens for development
const DEV_ACCESS_TOKEN = "dev_mock_access_token_12345";
const DEV_REFRESH_TOKEN = "dev_mock_refresh_token_12345";

// Mock organization profile
export const DEV_MOCK_PROFILE = {
  id: "dev-org-123",
  email: "dev@test.com",
  displayName: "Test Organization",
  industryId: 1,
  industry: { id: 1, name: "Technology" },
  size: "50-200",
  country: "United States",
  state: "California",
  city: "San Francisco",
  established: "2020-01-15",
  website: "https://example.com",
  whoWeAre: "We are a test organization for development purposes.",
  whatWeDo: "We test features and ensure everything works correctly.",
  profileImage: "",
  coverImage: "",
  approved: true,
};

// Mock consumer profile
export const DEV_MOCK_CONSUMER_PROFILE = {
  id: "dev-consumer-456",
  email: "consumer@test.com",
  displayName: "Test Consumer",
  industryId: 2,
  interests: [1, 2, 3, 4],
  country: "Canada",
  state: "Ontario",
  city: "Toronto",
  size: "Individual",
  established: "2023-01-15",
  website: "https://consumer-example.com",
  profileImage: "",
  coverImage: "",
};

/**
 * Initialize mock authentication for development
 * Call this on app startup in dev mode
 */
export function initDevAuth() {
  if (!isDevelopment || typeof window === "undefined") {
    return false;
  }

  // Set mock tokens and user data using secure storage
  setAccessToken(DEV_ACCESS_TOKEN);
  setRefreshToken(DEV_REFRESH_TOKEN);
  setUserEmail(DEV_MOCK_PROFILE.email);
  setUserName(DEV_MOCK_PROFILE.displayName);
  setUserType("ORGANIZATION"); // Set as organization by default

  // Log helpful information
  console.log(
    "%c🔧 DEV MODE ENABLED",
    "font-size: 16px; font-weight: bold; color: #EAB308;"
  );
  console.log("%c✅ Mock authentication initialized", "color: #10B981;");
  console.log(
    "%c💡 You can now access protected routes without logging in!",
    "color: #3B82F6;"
  );
  console.log("\nTry visiting:");
  console.log("  • /profile - View private profile");
  console.log("  • /profile/edit - Edit profile");
  console.log("  • /organization/dev-org-123 - View public profile");
  console.log("\nTo disable: Remove NEXT_PUBLIC_DEV_MODE from .env.local");

  return true;
}
/**
 * Check if dev mode is enabled
 */
export function isDevMode(): boolean {
  return isDevelopment;
}

/**
 * Get mock auth token for development
 */
export function getDevToken(): string | null {
  if (!isDevelopment) {
    return null;
  }
  return DEV_ACCESS_TOKEN;
}

/**
 * Clear dev auth tokens
 */
export function clearDevAuth() {
  if (!isDevelopment || typeof window === "undefined") {
    return;
  }

  clearAllAuthData();
  console.log("🔧 Dev mode: Mock authentication cleared");
}

/**
 * Check if user is authenticated (real or mock)
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const token = getAccessToken();
  return !!token;
}

/**
 * Toggle dev auth on/off in browser console
 * Usage: Run this in browser DevTools console
 */
export function toggleDevAuthInBrowser() {
  if (!isDevelopment) {
    console.warn(
      "⚠️ Dev mode is not enabled. Set NEXT_PUBLIC_DEV_MODE=true in .env.local"
    );
    return;
  }

  const hasToken = getAccessToken();

  if (hasToken) {
    clearDevAuth();
  } else {
    initDevAuth();
  }

  console.log("🔄 Refresh the page to see changes");
}

// Make it available in browser console for debugging
// Only execute in browser environment (not during SSR)
if (typeof globalThis !== "undefined" && typeof globalThis.window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis.window as any).toggleDevAuth = toggleDevAuthInBrowser;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis.window as any).initDevAuth = initDevAuth;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis.window as any).clearDevAuth = clearDevAuth;
}
