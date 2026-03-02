"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/button";
import FormInput from "@/components/atoms/form_input";
import Link from "next/link";
import { login, verifyLoginCode } from "@/lib/api/auth";

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

    // Save userId and show verification code input
    let receivedUserId: string | null = null;

    if (typeof result.data === "string") {
      receivedUserId = result.data;
    } else if (result.data?.userId) {
      receivedUserId = result.data.userId;
    }

    setUserId(receivedUserId);
    setIsCodeSent(true);
    setResendTimer(30);
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
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.refreshToken);
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userName", formData.email.split("@")[0]);

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

        {/* Divider & Sign Up Link - Only visible before code is sent */}
        {!isCodeSent && (
          <>
            {/* Divider */}
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

            {/* Sign Up Link */}
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
