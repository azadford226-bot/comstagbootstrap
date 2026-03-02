/**
 * Secure Storage Utility
 *
 * Provides a more secure alternative to localStorage for storing authentication tokens.
 * - Access tokens: stored in sessionStorage (cleared when tab closes)
 * - Refresh tokens: stored in memory with sessionStorage fallback
 * - User data: stored in sessionStorage
 *
 * This reduces XSS attack surface compared to localStorage while maintaining functionality.
 */

// In-memory storage for refresh token (most secure but lost on page reload)
let inMemoryRefreshToken: string | null = null;

const STORAGE_KEYS = {
  ACCESS_TOKEN: "comstag_access_token",
  REFRESH_TOKEN: "comstag_refresh_token", // fallback only
  USER_EMAIL: "comstag_user_email",
  USER_NAME: "comstag_user_name",
  USER_TYPE: "comstag_user_type",
} as const;

/**
 * Get access token from sessionStorage
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

/**
 * Set access token in sessionStorage
 */
export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}

/**
 * Remove access token from sessionStorage
 */
export function removeAccessToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
}

/**
 * Get refresh token from memory (preferred) or sessionStorage (fallback)
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;

  // Try memory first
  if (inMemoryRefreshToken) {
    return inMemoryRefreshToken;
  }

  // Fallback to sessionStorage for page reloads
  return sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Set refresh token in memory and sessionStorage (for page reload recovery)
 */
export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;

  // Store in memory (most secure)
  inMemoryRefreshToken = token;

  // Also store in sessionStorage as fallback for page reloads
  // Note: This is still more secure than localStorage as it's cleared when browser closes
  sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
}

/**
 * Remove refresh token from both memory and sessionStorage
 */
export function removeRefreshToken(): void {
  if (typeof window === "undefined") return;

  inMemoryRefreshToken = null;
  sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Get user email
 */
export function getUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEYS.USER_EMAIL);
}

/**
 * Set user email
 */
export function setUserEmail(email: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
}

/**
 * Get user name
 */
export function getUserName(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEYS.USER_NAME);
}

/**
 * Set user name
 */
export function setUserName(name: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEYS.USER_NAME, name);
}

/**
 * Get user type
 */
export function getUserType(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEYS.USER_TYPE);
}

/**
 * Set user type
 */
export function setUserType(type: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEYS.USER_TYPE, type);
}

/**
 * Clear all authentication data
 */
export function clearAllAuthData(): void {
  if (typeof window === "undefined") return;

  removeAccessToken();
  removeRefreshToken();
  sessionStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
  sessionStorage.removeItem(STORAGE_KEYS.USER_NAME);
  sessionStorage.removeItem(STORAGE_KEYS.USER_TYPE);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

// Backwards compatibility exports (to be removed after migration)
export const secureStorage = {
  getItem: (key: string) => {
    if (typeof window === "undefined") return null;

    // Map old localStorage keys to new secure storage
    switch (key) {
      case "accessToken":
        return getAccessToken();
      case "refreshToken":
        return getRefreshToken();
      case "userEmail":
        return getUserEmail();
      case "userName":
        return getUserName();
      case "userType":
        return getUserType();
      default:
        return sessionStorage.getItem(key);
    }
  },
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return;

    // Map old localStorage keys to new secure storage
    switch (key) {
      case "accessToken":
        setAccessToken(value);
        break;
      case "refreshToken":
        setRefreshToken(value);
        break;
      case "userEmail":
        setUserEmail(value);
        break;
      case "userName":
        setUserName(value);
        break;
      case "userType":
        setUserType(value);
        break;
      default:
        sessionStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") return;

    // Map old localStorage keys to new secure storage
    switch (key) {
      case "accessToken":
        removeAccessToken();
        break;
      case "refreshToken":
        removeRefreshToken();
        break;
      case "userEmail":
      case "userName":
      case "userType":
        sessionStorage.removeItem(
          STORAGE_KEYS[key.toUpperCase() as keyof typeof STORAGE_KEYS]
        );
        break;
      default:
        sessionStorage.removeItem(key);
    }
  },
};
