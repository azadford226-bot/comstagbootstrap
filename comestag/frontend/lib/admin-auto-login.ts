/**
 * Admin Auto-Login for Testing
 * 
 * This utility provides automatic admin login for testing purposes.
 * Only works in development mode (NEXT_PUBLIC_DEV_MODE=true).
 * 
 * WARNING: Never use this in production!
 */

import { login, verifyLoginCode } from "./api/auth";
import {
  setAccessToken,
  setRefreshToken,
  setUserEmail,
  setUserName,
  setUserType,
} from "./secure-storage";
import { logger } from "./logger";

const ADMIN_EMAIL = "admin@comstag.com";
const ADMIN_PASSWORD = "Admin@123!";

/**
 * Auto-login as admin for testing
 * This will attempt to login with the default admin credentials
 * and automatically handle the verification code flow
 */
export async function autoLoginAsAdmin(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  // Check if dev mode is enabled
  const isDevMode =
    process.env.NEXT_PUBLIC_DEV_MODE === "true" &&
    (process.env.VERCEL_ENV !== "production" || !process.env.VERCEL_ENV);

  if (!isDevMode) {
    logger.warn("Auto-login only works in dev mode. Set NEXT_PUBLIC_DEV_MODE=true");
    return false;
  }

  try {
    logger.info("Attempting auto-login as admin...");

    // Step 1: Login with email and password
    const loginResult = await login({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (!loginResult.success || !loginResult.data?.userId) {
      logger.error("Admin login failed", loginResult);
      return false;
    }

    const userId = loginResult.data.userId;
    logger.info("Login successful, waiting for verification code...");

    // Step 2: For auto-login, we need to get the verification code
    // In a real scenario, this would come from email
    // For testing, we'll try to get it from the backend or use a test code
    // Note: This is a simplified version - in production, you'd need to check email
    
    // For now, we'll show a message that manual verification is needed
    logger.warn(
      "Auto-login requires verification code. " +
      "Please check your email or use the admin login page to complete verification."
    );

    return false; // Return false to indicate manual verification needed
  } catch (error) {
    logger.error("Auto-login error", error);
    return false;
  }
}

/**
 * Complete admin login with verification code
 * Call this after receiving the verification code
 */
export async function completeAdminLogin(
  userId: string,
  verificationCode: string
): Promise<boolean> {
  try {
    const identifier = `${userId}_${verificationCode}`;

    const result = await verifyLoginCode({ identifier });

    if (result.success && result.data) {
      setAccessToken(result.data.accessToken);
      setRefreshToken(result.data.refreshToken);
      setUserEmail(ADMIN_EMAIL);
      setUserName("Admin");
      setUserType("ADMIN");

      // Dispatch storage event to update auth state
      window.dispatchEvent(new Event("storage"));

      logger.info("Admin login completed successfully");
      return true;
    }

    logger.error("Verification failed", result);
    return false;
  } catch (error) {
    logger.error("Complete admin login error", error);
    return false;
  }
}

/**
 * Check if we're in dev mode and can use auto-login
 */
export function canUseAutoLogin(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    process.env.NEXT_PUBLIC_DEV_MODE === "true" &&
    (process.env.VERCEL_ENV !== "production" || !process.env.VERCEL_ENV)
  );
}
