import { logout as logoutApi } from "@/lib/api/auth";
import { logger } from "@/lib/logger";
import {
  clearAllAuthData,
  removeAccessToken,
  removeRefreshToken,
} from "../secure-storage";

export const logout = async (): Promise<void> => {
  logger.info("Logout function called");

  try {
    // Call the logout API to invalidate the token on the server
    const result = await logoutApi();

    if (!result.success) {
      logger.warn("Logout API failed, clearing local session anyway", {
        message: result.message,
      });
    }
  } catch (error) {
    logger.error("Logout error, clearing local session anyway", error);
  } finally {
    // Always clear local storage, even if API call fails
    clearAllAuthData();

    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"));
  }
};
