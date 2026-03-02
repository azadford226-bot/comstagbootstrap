"use client";

import { useState, useEffect } from "react";
import Button from "@/components/atoms/button";
import FormInput from "@/components/atoms/form_input";
import Link from "next/link";
import { sendVerificationCode, resetPassword } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer countdown for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await sendVerificationCode({
      email,
      verificationType: "CODE",
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.message || "Failed to send verification code");
      return;
    }

    setIsCodeSent(true);
    setResendTimer(30);
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError(null);

    const result = await sendVerificationCode({
      email,
      verificationType: "CODE",
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.message || "Failed to resend verification code");
      return;
    }

    setResendTimer(30);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const result = await resetPassword({
      email,
      newPassword,
      verificationCode,
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.message || "Password reset failed");
      return;
    }

    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[200px] md:h-[257px] flex flex-col items-center justify-center gap-4 md:gap-[27px] px-4 sm:px-8 md:px-20 lg:px-[303px] py-8 md:py-[47px]">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-white text-center">
          Forgot Password
        </h1>
        <p className="text-xl sm:text-2xl md:text-[32px] text-white text-center font-['Hubballi']">
          Reset Your Account Access
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[50px] py-6 md:py-[46px]">
        {/* Header - Only show if not success */}
        {!isSuccess && (
          <div className="text-center mb-12 md:mb-[94px]">
            <h2 className="text-xl md:text-[24px] font-semibold text-primary-dark mb-2">
              Reset Your Password
            </h2>
            <p className="text-lg md:text-[20px] font-light text-primary-dark">
              {isCodeSent
                ? "Enter the verification code and your new password"
                : "Enter your email address and we'll send you a verification code"}
            </p>
          </div>
        )}

        {/* Form */}
        <div className="max-w-[600px] mx-auto">
          {isSuccess ? (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-off-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-primary-dark mb-4">
                Password Reset Successful!
              </h3>
              <p className="text-base md:text-lg text-text-body mb-8">
                Your password has been successfully reset. You can now login
                with your new password.
              </p>
              <Link href="/login">
                <Button type="primary">Go to Login</Button>
              </Link>
            </div>
          ) : (
            <form
              onSubmit={isCodeSent ? handleResetPassword : handleSendCode}
              className="flex flex-col gap-6"
            >
              {/* Error Message */}
              {error && (
                <div className="bg-accent-light border border-accent text-primary-dark px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Info Message */}
              {!isCodeSent ? (
                <div className="bg-off-white border border-pale-blue text-primary-dark px-4 py-3 rounded-lg text-sm">
                  Enter the email address associated with your account and
                  we&apos;ll send you a verification code to reset your
                  password.
                </div>
              ) : (
                <div className="bg-off-white border border-pale-blue text-primary-dark px-4 py-3 rounded-lg text-sm">
                  We&apos;ve sent a verification code to{" "}
                  <strong>{email}</strong>. Enter the code below along with your
                  new password.
                </div>
              )}

              {/* Email - Always visible but disabled after code is sent */}
              <FormInput
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isCodeSent}
              />

              {/* Verification Code - Only visible after code is sent */}
              {isCodeSent && (
                <>
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
                    <div className="mt-2 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={resendTimer > 0 || isLoading}
                        className="text-sm text-primary-dark hover:text-primary underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                      >
                        {resendTimer > 0
                          ? `Resend code in ${resendTimer}s`
                          : "Resend code"}
                      </button>
                    </div>
                  </div>

                  <FormInput
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 8 characters)"
                    required
                  />

                  <FormInput
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </>
              )}

              {/* Submit Button */}
              <div className="mt-4">
                <Button
                  type="primary"
                  buttonType="submit"
                  fullWidth
                  disabled={isLoading || (!isCodeSent && !email.trim())}
                >
                  {isLoading
                    ? isCodeSent
                      ? "Resetting..."
                      : "Sending..."
                    : isCodeSent
                    ? "Reset Password"
                    : "Send Verification Code"}
                </Button>
              </div>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-primary-dark hover:text-primary underline"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
