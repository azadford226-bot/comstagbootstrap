"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/button";
import FormInput from "@/components/atoms/form_input";
import Link from "next/link";
import { login, verifyLoginCode } from "@/lib/api/auth";
import {
  setAccessToken,
  setRefreshToken,
  setUserEmail,
  setUserName,
  setUserType,
} from "@/lib/secure-storage";

const TEST_COMPANY_CREDENTIALS = {
  email: "tester@comstag.com",
  password: "Test@123!",
  displayName: "Test Company",
};

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingQuick, setLoadingQuick] = useState(false);

  // Timer countdown for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Step 1: Login with email and password
    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.message || "Login failed");
      return;
    }

    // Check if this is an ADMIN login with tokens
    if (result.data?.accessToken && result.data?.refreshToken) {
      // ADMIN login - tokens received directly, no verification needed
      setAccessToken(result.data.accessToken);
      setRefreshToken(result.data.refreshToken);
      setUserEmail(formData.email);
      setUserName(formData.email.split("@")[0]);
      setUserType("ADMIN");

      // Fetch profile to get display name
      try {
        const profileResponse = await fetch("/api/proxy/v1/profile", {
          headers: {
            Authorization: `Bearer ${result.data.accessToken}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userProfile = profileData.userDetails || profileData;
          if (userProfile.displayName) {
            setUserName(userProfile.displayName);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }

      // Trigger storage event so navbar detects auth change
      window.dispatchEvent(new Event("storage"));
      
      // Redirect to admin dashboard
      router.push("/admin/dashboard");
      return;
    }

    // Regular user login - needs verification code
    // Save userId and show verification code input
    let receivedUserId: string | null = null;

    if (typeof result.data === "string") {
      receivedUserId = result.data;
    } else if (result.data?.userId) {
      receivedUserId = result.data.userId;
    }

    if (!receivedUserId) {
      setError("Login failed - no user ID received");
      return;
    }

    setUserId(receivedUserId);
    setIsCodeSent(true);
    setResendTimer(30);
  };

  const handleQuickTestLogin = async () => {
    setIsLoading(true);
    setLoadingQuick(true);
    setError(null);

    setFormData({
      email: TEST_COMPANY_CREDENTIALS.email,
      password: TEST_COMPANY_CREDENTIALS.password,
      rememberMe: false,
    });

    const result = await login({
      email: TEST_COMPANY_CREDENTIALS.email,
      password: TEST_COMPANY_CREDENTIALS.password,
    });

    if (!result.success) {
      setError(result.message || "Test login failed. Account may not exist.");
      setIsLoading(false);
      setLoadingQuick(false);
      return;
    }

    if (result.data?.accessToken && result.data?.refreshToken) {
      setAccessToken(result.data.accessToken);
      setRefreshToken(result.data.refreshToken);
      setUserEmail(TEST_COMPANY_CREDENTIALS.email);
      setUserName(TEST_COMPANY_CREDENTIALS.displayName);
      setUserType("ORGANIZATION");
      window.dispatchEvent(new Event("storage"));
      router.push("/dashboard");
      setIsLoading(false);
      setLoadingQuick(false);
      return;
    }

    let receivedUserId: string | null = null;
    if (typeof result.data === "string") {
      receivedUserId = result.data;
    } else if (result.data?.userId) {
      receivedUserId = result.data.userId;
    }

    if (!receivedUserId) {
      setError("Login failed - no user ID received");
      setIsLoading(false);
      setLoadingQuick(false);
      return;
    }

    setUserId(receivedUserId);
    setIsCodeSent(true);
    setResendTimer(30);
    setIsLoading(false);
    setLoadingQuick(false);
  };

  const handleResendCode = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!userId) {
      setError("Session expired. Please login again.");
      setIsCodeSent(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Resend code by calling login again
    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.message || "Failed to resend code");
      return;
    }

    // Update userId in case it changed
    if (result.data) {
      if (typeof result.data === "string") {
        setUserId(result.data);
      } else if (result.data.userId) {
        setUserId(result.data.userId);
      }
    }

    setResendTimer(30);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    setError(null);

    if (!userId) {
      setError("Session expired. Please login again.");
      setIsCodeSent(false);
      setIsLoading(false);
      return;
    }

    // Step 2: Verify code with identifier (userId_code)
    const identifier = `${userId}_${verificationCode}`;

    const result = await verifyLoginCode({
      identifier,
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.message || "Invalid verification code");
      return;
    }

    // Save tokens
    if (result.data) {
      setAccessToken(result.data.accessToken);
      setRefreshToken(result.data.refreshToken);
      setUserEmail(formData.email);
      setUserName(formData.email.split("@")[0]);

      // Fetch profile to get user type and display name
      try {
        const profileResponse = await fetch("/v1/profile", {
          headers: {
            Authorization: `Bearer ${result.data.accessToken}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userProfile = profileData.userDetails || profileData;

          // Determine user type from profile
          if (userProfile.size || userProfile.whoWeAre) {
            // Organization profile has size and whoWeAre fields
            setUserType("ORGANIZATION");
          } else if (userProfile.interests) {
            // Consumer profile has interests field
            setUserType("CONSUMER");
          }
          
          // Update display name if available
          if (userProfile.displayName) {
            setUserName(userProfile.displayName);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }

      // Trigger storage event so navbar detects auth change
      window.dispatchEvent(new Event("storage"));
    } else {
      setError("Login failed - no tokens received");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="max-w-[600px] mx-auto">
      {/* Header */}
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-xl md:text-[24px] font-semibold text-primary-dark mb-2">
          Sign In
        </h2>
        <p className="text-lg md:text-[20px] font-light text-primary-dark">
          {isCodeSent
            ? "Enter the verification code sent to your email"
            : "Access your ComStag account"}
        </p>
      </div>

      <form
        onSubmit={isCodeSent ? handleVerifyCode : handleSubmit}
        className="flex flex-col gap-6"
      >
        {/* Error Message */}
        {error && (
          <div className="bg-accent-light border border-accent text-primary-dark px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Info Message - Show after code is sent */}
        {isCodeSent && (
          <div className="bg-off-white border border-pale-blue text-primary-dark px-4 py-3 rounded-lg text-sm">
            We&apos;ve sent a verification code to{" "}
            <strong>{formData.email}</strong>. Enter the code below to complete
            your login.
          </div>
        )}

        {/* Email - Always visible but disabled after code is sent */}
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
          disabled={isCodeSent}
        />

        {/* Password - Only visible before code is sent */}
        {!isCodeSent && (
          <div className="relative">
            <FormInput
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-3 text-text-body hover:text-primary-dark transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Verification Code - Only visible after code is sent */}
        {isCodeSent && (
          <div>
            <FormInput
              label="Verification Code"
              type="text"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              required
            />
            <div className="mt-3 text-sm">
              {resendTimer > 0 ? (
                <span className="text-text-body">
                  Resend code in {resendTimer}s
                </span>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleResendCode(e);
                    }}
                    disabled={isLoading}
                    className="font-medium text-primary hover:text-primary-dark underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    style={{ pointerEvents: "auto" }}
                  >
                    Resend code
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Remember Me & Forgot Password - Only visible before code is sent */}
        {!isCodeSent && (
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-dark border-pale-blue rounded focus:ring-primary-dark"
              />
              <span className="text-sm text-text-body">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary-dark hover:text-primary underline"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-4">
          <Button
            type="primary"
            fullWidth
            form
            disabled={
              isLoading ||
              (!isCodeSent &&
                (!formData.email.trim() || !formData.password.trim()))
            }
            buttonType="submit"
          >
            {isLoading
              ? isCodeSent
                ? "Verifying..."
                : "Signing in..."
              : isCodeSent
              ? "Verify & Login"
              : "Sign In"}
          </Button>
        </div>

        {/* Quick Test Login Button */}
        {!isCodeSent && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleQuickTestLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
            >
              {loadingQuick ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              <div className="text-left">
                <div className="font-semibold">Quick Company Login</div>
                <div className="text-xs text-emerald-200">tester@comstag.com &middot; Company dashboard</div>
              </div>
            </button>
          </div>
        )}

        {/* SSO — hidden until NEXT_PUBLIC_SSO_ENABLED=true (avoids expectation debt) */}
        {!isCodeSent && process.env.NEXT_PUBLIC_SSO_ENABLED === "true" && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-pale-blue"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-text-body">
                  Or continue with
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-2" title="Single sign-on connects your corporate identity provider for faster, audited access.">
              Why SSO? Enterprise teams use IdPs for security and onboarding — we&apos;ll enable this when ready.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Google", icon: <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
                { name: "Microsoft", icon: <svg className="w-5 h-5" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg> },
                { name: "LinkedIn", icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                { name: "GitHub", icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#181717"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
              ].map((provider) => (
                <button
                  key={provider.name}
                  type="button"
                  disabled
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed relative"
                  title="Coming soon"
                >
                  <span className="opacity-40">{provider.icon}</span>
                  <span>{provider.name}</span>
                  <span className="absolute -top-2 -right-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">Soon</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Divider & Sign Up Link - Only visible before code is sent */}
        {!isCodeSent && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-pale-blue"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-text-body">
                  Don&apos;t have an account?
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link href="/signup-select">
                <Button type="secondary" fullWidth>
                  Create an Account
                </Button>
              </Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
