import { logger } from "@/lib/logger";
import { refreshAccessToken } from "./auth";
import { isDevMode, getDevToken } from "@/lib/dev-auth";
import {
  getAccessToken,
  removeAccessToken,
  removeRefreshToken,
} from "../secure-storage";

// API base URL - use relative path when served from same origin as backend
// When frontend and backend are on the same port, use empty string for relative paths
// Otherwise use the configured URL or default to localhost:3000
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined"
    ? "" // Use relative paths when served from same origin
    : "http://localhost:3000"); // SSR fallback

// Track if we're currently refreshing to avoid multiple refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Refresh the access token if needed
 */
async function refreshToken(): Promise<boolean> {
  // If already refreshing, wait for that to complete
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const result = await refreshAccessToken();
      return result.success;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Make an authenticated API request with automatic token refresh on 401
 */
export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {},
  retryOnUnauthorized = true
): Promise<Response> {
  // In dev mode, use mock token
  const accessToken = isDevMode() ? getDevToken() : getAccessToken();

  // Build headers - don't set Content-Type for FormData (browser will set it with boundary)
  const isFormData = options.body instanceof FormData;
  const headers: HeadersInit = {
    ...options.headers,
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  // Remove Content-Type for FormData to let browser set it with boundary
  if (isFormData && headers instanceof Headers) {
    headers.delete("Content-Type");
  } else if (isFormData && typeof headers === "object" && headers !== null) {
    delete (headers as Record<string, string>)["Content-Type"];
    delete (headers as Record<string, string>)["content-type"];
  }

  logger.api(options.method || "GET", endpoint, {
    hasToken: !!accessToken,
    devMode: isDevMode(),
    isFormData,
  });

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (fetchError) {
    // Handle connection errors (e.g., backend not running)
    if (fetchError instanceof TypeError && fetchError.message.includes("Failed to fetch")) {
      const isDevelopment = process.env.NODE_ENV !== "production";
      if (isDevelopment && !isDevMode()) {
        logger.warn(
          "Backend connection failed. Consider enabling dev mode by setting NEXT_PUBLIC_DEV_MODE=true in .env.local, or start the backend server."
        );
      }
      // Re-throw to be handled by caller
      throw fetchError;
    }
    throw fetchError;
  }

  // Handle 401 or check if 403 is token-related
  if ((response.status === 401 || response.status === 403) && retryOnUnauthorized) {
    // For 403, check if it's token-related by examining the error message
    let shouldRefresh = response.status === 401;
    
    if (response.status === 403) {
      try {
        // Clone response to read body without consuming it
        const clonedResponse = response.clone();
        const errorData = await clonedResponse.json().catch(() => ({}));
        const errorMessage = (errorData.message || errorData.error || '').toLowerCase();
        
        // Check if error message indicates token/auth issue
        shouldRefresh = errorMessage.includes('token') || 
                       errorMessage.includes('unauthorized') || 
                       errorMessage.includes('authentication') ||
                       errorMessage.includes('expired') ||
                       errorMessage.includes('invalid');
        
        if (shouldRefresh) {
          logger.warn(`403 appears to be token-related: ${errorMessage}`);
        } else {
          logger.warn(`403 appears to be permission-related: ${errorMessage}`);
        }
      } catch {
        // If we can't parse response, assume it's permission-related to avoid loops
        logger.debug("Could not parse 403 response, assuming permission issue");
        shouldRefresh = false;
      }
    }

    if (shouldRefresh) {
      logger.warn(`Received ${response.status}, attempting token refresh`);

      const refreshed = await refreshToken();

      if (refreshed) {
        logger.info("Token refreshed, retrying request");
        // Retry the request with new token (but don't retry again if it fails)
        return authenticatedFetch(endpoint, options, false);
      } else {
        logger.error("Token refresh failed, redirecting to login");
        // Clear tokens and redirect to login
        removeAccessToken();
        removeRefreshToken();

        // Only redirect if we're in the browser
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
  }

  return response;
}

/**
 * Helper function for GET requests
 */
export async function authenticatedGet<T = unknown>(
  endpoint: string
): Promise<{ success: boolean; data?: T; message?: string; status?: number }> {
  try {
    const response = await authenticatedFetch(endpoint, { method: "GET" });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        status: response.status,
        message:
          error.message || `Request failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    logger.error("API GET error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Helper function for POST requests
 */
export async function authenticatedPost<T = unknown>(
  endpoint: string,
  body?: unknown
): Promise<{ success: boolean; data?: T; message?: string; status?: number }> {
  try {
    const response = await authenticatedFetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        status: response.status,
        message:
          error.message || `Request failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    logger.error("API POST error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Helper function for PUT requests
 */
export async function authenticatedPut<T = unknown>(
  endpoint: string,
  body?: unknown
): Promise<{ success: boolean; data?: T; message?: string; status?: number }> {
  try {
    const response = await authenticatedFetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        status: response.status,
        message:
          error.message || `Request failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    logger.error("API PUT error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Helper function for DELETE requests
 */
export async function authenticatedDelete<T = unknown>(
  endpoint: string
): Promise<{ success: boolean; data?: T; message?: string; status?: number }> {
  try {
    const response = await authenticatedFetch(endpoint, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        status: response.status,
        message:
          error.message || `Request failed with status ${response.status}`,
      };
    }

    // DELETE might return empty response
    const text = await response.text();
    const data = text ? JSON.parse(text) : undefined;

    return {
      success: true,
      data,
    };
  } catch (error) {
    logger.error("API DELETE error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}
