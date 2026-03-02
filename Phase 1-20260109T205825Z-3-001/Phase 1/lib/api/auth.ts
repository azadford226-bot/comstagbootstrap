import { logger } from "@/lib/logger";

// API base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined"
    ? "/api/proxy" // Use Next.js proxy in browser to avoid CORS
    : "https://comstag-back.onrender.com"); // Direct call from server

// Types for registration
export interface OrganizationRegistrationRequest {
  email: string;
  password: string;
  displayName: string;
  industry: string;
  size: string;
  country: string;
  city: string;
  established: string;
  website: string;
  whoWeAre: string;
  whatWeDo: string;
  capabilities: string;
}

export interface ConsumerRegistrationRequest {
  email: string;
  password: string;
  displayName: string;
  industry: string;
  country: string;
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
  userId: string;
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
    logger.api("POST", `${API_BASE_URL}/v1/auth/register/org`, { data });

    const response = await fetch(`${API_BASE_URL}/v1/auth/register/org`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

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

    const result = await response.json();
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
    logger.api("POST", `${API_BASE_URL}/v1/auth/register/cons`, { data });

    const response = await fetch(`${API_BASE_URL}/v1/auth/register/cons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

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

    const result = await response.json();
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
    logger.api("POST", `${API_BASE_URL}/v1/auth/login`, { email: data.email });

    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
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
    logger.info("Login successful, verification code sent", {
      userId: result.userId,
    });

    return {
      success: true,
      data: result,
      message: "Verification code sent to your email",
    };
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
    const url = `${API_BASE_URL}/v1/auth/code-verify?identifier=${encodeURIComponent(
      data.identifier
    )}`;

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
    const url = `${API_BASE_URL}/v1/auth/email-verify?identifier=${encodeURIComponent(
      data.identifier
    )}`;

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

    const url = `${API_BASE_URL}/v1/auth/retry-verification/?${params.toString()}`;

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
    const response = await fetch(`${API_BASE_URL}/v1/auth/reset-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

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
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${API_BASE_URL}/v1/profile/reset-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || "Password change failed",
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
      message: "Password changed successfully",
    };
  } catch (error) {
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
    const refreshToken = localStorage.getItem("refreshToken");
    logger.warn("Logging out user", { refreshToken });

    if (!refreshToken) {
      logger.warn("Logout called with no refresh token");
      return {
        success: true,
        message: "No active session",
      };
    }

    logger.api("POST", "/v1/auth/logout");

    const response = await fetch(`${API_BASE_URL}/v1/auth/logout`, {
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
