import { logger } from "@/lib/logger";
import { AUTH_ENDPOINTS, PROFILE_ENDPOINTS } from "./endpoints";
import {
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  clearAllAuthData,
} from "@/lib/secure-storage";
import { isDevMode } from "@/lib/dev-auth";

// API base URL - use relative path when served from same origin as backend
// When frontend and backend are on the same port, use empty string for relative paths
// Otherwise use the configured URL or default to localhost:3000
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined"
    ? "" // Use relative paths when served from same origin
    : "http://localhost:3000"); // SSR fallback

// Types for registration
export interface OrganizationRegistrationRequest {
  email: string;
  password: string;
  displayName: string;
  industryId: number | string;
  size: string;
  country: string;
  state: string;
  city: string;
  established: string;
  website: string;
  whoWeAre: string;
  whatWeDo: string;
}

export interface ConsumerRegistrationRequest {
  email: string;
  password: string;
  displayName: string;
  industryId: number | string;
  interests: number[];
  country: string;
  state: string;
  city: string;
  size: string;
  established: string;
  website: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
  isAdmin?: boolean;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CodeVerifyRequest {
  identifier: string;
}

export interface CodeVerifyResponse {
  accessToken: string;
  refreshToken: string;
}

export interface EmailVerifyRequest {
  identifier: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  verificationCode: string;
}

export interface ChangePasswordRequest {
  email: string;
  newPassword: string;
  oldPassword: string;
}

export interface SendVerificationRequest {
  email?: string;
  identifier?: string;
  verificationType: "EMAIL" | "CODE";
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Register organization
 */
export async function registerOrganization(
  data: OrganizationRegistrationRequest
): Promise<ApiResponse> {
  try {
    logger.api(
      "POST",
      `${API_BASE_URL}${AUTH_ENDPOINTS.REGISTER_ORGANIZATION}`,
      { data }
    );

    const response = await fetch(
      `${API_BASE_URL}${AUTH_ENDPOINTS.REGISTER_ORGANIZATION}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    logger.debug("Organization registration response received", {
      status: response.status,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error("Organization registration API error", error, {
        status: response.status,
      });

      let errorMessage =
        error.message || `Registration failed (${response.status})`;

      // Handle specific status codes
      if (response.status === 409) {
        errorMessage =
          error.message ||
          "This email is already registered. Please use a different email or try logging in.";
      } else if (response.status === 400) {
        errorMessage =
          error.message ||
          "Invalid registration data. Please check all fields.";
      } else if (response.status === 403) {
        errorMessage =
          error.message || "Access forbidden. Please contact support.";
      }

      return {
        success: false,
        message: errorMessage,
        errors: error.errors,
      };
    }

    // Handle 201 Created with no body - registration successful
    const contentType = response.headers.get("content-type");
    if (response.status === 201 && (!contentType || !contentType.includes("application/json"))) {
      // No JSON body, registration was successful
      logger.info("Organization registered successfully");
      return {
        success: true,
        data: null,
        message: "Organization registered successfully",
      };
    }

    // Try to parse JSON only if there's content
    const text = await response.text();
    const result = text ? JSON.parse(text) : null;
    logger.info("Organization registered successfully", { result });
    return {
      success: true,
      data: result,
      message: "Organization registered successfully",
    };
  } catch (error) {
    logger.error("Network error during organization registration", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Register consumer
 */
export async function registerConsumer(
  data: ConsumerRegistrationRequest
): Promise<ApiResponse> {
  try {
    logger.api("POST", `${API_BASE_URL}${AUTH_ENDPOINTS.REGISTER_CONSUMER}`, {
      data,
    });

    const response = await fetch(
      `${API_BASE_URL}${AUTH_ENDPOINTS.REGISTER_CONSUMER}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    logger.debug("Consumer registration response received", {
      status: response.status,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error("Consumer registration API error", error, {
        status: response.status,
      });

      let errorMessage =
        error.message || `Registration failed (${response.status})`;

      // Handle specific status codes
      if (response.status === 409) {
        errorMessage =
          error.message ||
          "This email is already registered. Please use a different email or try logging in.";
      } else if (response.status === 400) {
        errorMessage =
          error.message ||
          "Invalid registration data. Please check all fields.";
      } else if (response.status === 403) {
        errorMessage =
          error.message || "Access forbidden. Please contact support.";
      }

      return {
        success: false,
        message: errorMessage,
        errors: error.errors,
      };
    }

    // Handle 201 Created with no body - registration successful
    const contentType = response.headers.get("content-type");
    if (response.status === 201 && (!contentType || !contentType.includes("application/json"))) {
      // No JSON body, registration was successful
      logger.info("Consumer registered successfully");
      return {
        success: true,
        data: null,
        message: "Consumer registered successfully",
      };
    }

    // Try to parse JSON only if there's content
    const text = await response.text();
    const result = text ? JSON.parse(text) : null;
    logger.info("Consumer registered successfully", { result });
    return {
      success: true,
      data: result,
      message: "Consumer registered successfully",
    };
  } catch (error) {
    logger.error("Network error during consumer registration", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Login - Step 1: Send email and password, receive userId and code sent to email
 */
export async function login(
  data: LoginRequest
): Promise<ApiResponse<LoginResponse>> {
  try {
    logger.api("POST", `${API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`, {
      email: data.email,
    });

    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    logger.debug("Login response received", { status: response.status });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("Login error response", {
        errorText,
        status: response.status,
      });

      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText };
      }

      logger.error("Login failed", error);

      return {
        success: false,
        message: error.errorMessage || error.message || "Login failed",
        errors: error.errors,
      };
    }

    const resultText = await response.text();
    logger.debug("Login response text received", { hasContent: !!resultText });

    const result = resultText ? JSON.parse(resultText) : {};
    
    // Check if this is an ADMIN login (has tokens) or regular user (has userId)
    if (result.accessToken && result.refreshToken) {
      // ADMIN login - tokens returned directly
      logger.info("Admin login successful, tokens received");
      return {
        success: true,
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          isAdmin: true,
        },
        message: "Login successful",
      };
    } else if (result.userId) {
      // Regular user login - needs verification code
      logger.info("Login successful, verification code sent", {
        userId: result.userId,
      });
      return {
        success: true,
        data: {
          userId: result.userId,
          isAdmin: false,
        },
        message: "Verification code sent to your email",
      };
    } else {
      // Fallback: try to parse as UUID (old format)
      logger.info("Login successful, verification code sent (legacy format)");
      return {
        success: true,
        data: {
          userId: resultText || result,
          isAdmin: false,
        },
        message: "Verification code sent to your email",
      };
    }
  } catch (error) {
    logger.error("Login exception", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Login - Step 2: Verify code with userId, receive access and refresh tokens
 */
export async function verifyLoginCode(
  data: CodeVerifyRequest
): Promise<ApiResponse<CodeVerifyResponse>> {
  try {
    // identifier should be a query parameter, not in the body
    const url = `${API_BASE_URL}${
      AUTH_ENDPOINTS.VERIFY_CODE
    }?identifier=${encodeURIComponent(data.identifier)}`;

    logger.api("POST", url, { identifier: data.identifier });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: "", // Empty body as per API spec
    });

    logger.debug("Code verification response received", {
      status: response.status,
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("Code verification error response", {
        errorText,
        status: response.status,
      });

      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText };
      }

      logger.error("Code verification failed", error);

      return {
        success: false,
        message:
          error.errorMessage || error.message || "Invalid verification code",
      };
    }

    const resultText = await response.text();
    logger.debug("Verification response text received", {
      hasContent: !!resultText,
    });

    const result = resultText ? JSON.parse(resultText) : {};
    logger.info("Code verification successful", {
      hasTokens: !!(result.accessToken && result.refreshToken),
    });

    return {
      success: true,
      data: result,
      message: "Login successful",
    };
  } catch (error) {
    logger.error("Code verification exception", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Email Verification - Verify email using identifier from magic link
 */
export async function verifyEmail(
  data: EmailVerifyRequest
): Promise<ApiResponse> {
  try {
    const url = `${API_BASE_URL}${
      AUTH_ENDPOINTS.EMAIL_VERIFY
    }?identifier=${encodeURIComponent(data.identifier)}`;

    logger.api("POST", url, { identifier: data.identifier });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    logger.debug("Email verification response received", {
      status: response.status,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error("Email verification failed", error, {
        status: response.status,
      });
      return {
        success: false,
        message:
          error.errorMessage || error.message || "Email verification failed",
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
      message: "Email verified successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Send Verification Code - Send verification code via email or SMS
 */
export async function sendVerificationCode(
  data: SendVerificationRequest
): Promise<ApiResponse> {
  try {
    // Use proxy - construct URL carefully
    const params = new URLSearchParams();

    // Use identifier if provided, otherwise use email
    if (data.identifier) {
      params.append("identifier", data.identifier);
    } else if (data.email) {
      params.append("email", data.email);
    }

    params.append("verificationType", data.verificationType);

    const url = `${API_BASE_URL}${
      AUTH_ENDPOINTS.REQUEST_CODE
    }?${params.toString()}`;

    logger.api("POST", url, {
      email: data.email,
      identifier: data.identifier,
      verificationType: data.verificationType,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        accept: "*/*",
      },
      body: "",
    });

    logger.debug("Verification code response received", {
      status: response.status,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error("Failed to send verification code", error, {
        status: response.status,
      });
      return {
        success: false,
        message:
          error.errorMessage ||
          error.message ||
          "Failed to send verification code",
      };
    }

    // Handle empty response body
    const text = await response.text();
    const result = text ? JSON.parse(text) : {};

    return {
      success: true,
      data: result,
      message: "Verification code sent successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Reset Password - Reset user password with verification code
 */
export async function resetPassword(
  data: ResetPasswordRequest
): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}${AUTH_ENDPOINTS.RESET_PASSWORD}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || "Password reset failed",
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
      message: "Password reset successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Change Password - Change user password in profile
 */
export async function changePassword(
  data: ChangePasswordRequest
): Promise<ApiResponse> {
  try {
    // Import authenticatedPost dynamically to avoid circular dependency
    const { authenticatedPost } = await import("./api-client");

    const result = await authenticatedPost(
      PROFILE_ENDPOINTS.RESET_PASSWORD,
      data
    );

    return {
      success: result.success,
      data: result.data,
      message:
        result.message ||
        (result.success
          ? "Password changed successfully"
          : "Password change failed"),
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Refresh Access Token - Get new access token using refresh token
 */
export async function refreshAccessToken(): Promise<
  ApiResponse<RefreshTokenResponse>
> {
  try {
    const refreshToken = getRefreshToken();
    logger.info("Refreshing access token");

    if (!refreshToken) {
      logger.warn("No refresh token available");
      return {
        success: false,
        message: "No refresh token available",
      };
    }

    logger.api("POST", AUTH_ENDPOINTS.REFRESH_TOKEN);

    const response = await fetch(
      `${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error("Token refresh failed", { status: response.status, error });

      // If refresh token is invalid, clear storage
      if (response.status === 401 || response.status === 403) {
        clearAllAuthData();
      }

      return {
        success: false,
        message: error.message || "Token refresh failed",
      };
    }

    const result = await response.json();

    // Store new tokens
    if (result.accessToken) {
      setAccessToken(result.accessToken);
    }
    if (result.refreshToken) {
      setRefreshToken(result.refreshToken);
    }

    logger.info("Token refreshed successfully");
    return {
      success: true,
      data: result,
      message: "Token refreshed successfully",
    };
  } catch (error) {
    logger.error("Token refresh network error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Logout - Logout user and invalidate token
 */
export async function logout(): Promise<ApiResponse> {
  try {
    const refreshToken = getRefreshToken();
    logger.warn("Logging out user", { refreshToken });

    if (!refreshToken) {
      logger.warn("Logout called with no refresh token");
      return {
        success: true,
        message: "No active session",
      };
    }

    // In dev mode, skip API call and return success
    if (isDevMode()) {
      if (process.env.NODE_ENV === "development") {
        console.log("🔧 [DEV MODE] Skipping logout API call");
      }
      logger.info("Logout successful (dev mode)");
      return {
        success: true,
        message: "Logged out successfully",
      };
    }

    logger.api("POST", AUTH_ENDPOINTS.LOGOUT);

    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.LOGOUT}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error("Logout API failed", { status: response.status, error });
      return {
        success: false,
        message: error.message || "Logout failed",
      };
    }

    logger.info("Logout successful");
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    logger.error("Logout network error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}
