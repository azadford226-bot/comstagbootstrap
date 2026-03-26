import { logger } from "@/lib/logger";

function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_USE_PROXY === "true") return "/api/proxy";
  if (typeof window !== "undefined" && window.location?.hostname?.includes("vercel.app")) {
    return "/api/proxy";
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "";
}

export type OAuthProviderInfo = {
  id: string;
  name: string;
  enabled: boolean;
};

export type OAuthProvidersResponse = {
  providers: OAuthProviderInfo[];
};

/**
 * Public endpoint — lists IdPs for login UI. Backend may mark providers disabled until registered in Spring.
 */
export async function fetchOAuth2Providers(): Promise<OAuthProvidersResponse | null> {
  const base = getApiBaseUrl();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/v1/auth/oauth2/providers`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as OAuthProvidersResponse;
  } catch (e) {
    logger.debug("OAuth providers fetch failed", {
      error: e instanceof Error ? e.message : String(e),
    });
    return null;
  }
}

/** Spring Boot default authorization URL pattern */
export function getOAuthAuthorizationPath(registrationId: string): string {
  return `/oauth2/authorization/${registrationId}`;
}

/**
 * Absolute origin where the Spring app serves OAuth (not the Next.js host).
 * Set NEXT_PUBLIC_OAUTH_LOGIN_BASE_URL to your Railway/API URL when the frontend is on Vercel.
 */
export function getOAuthLoginBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_OAUTH_LOGIN_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "";
  return raw.replace(/\/$/, "");
}

/** Registration IDs that exist in application.properties for this project */
export const OAUTH_REGISTRATION_IDS = new Set(["google", "github"]);
