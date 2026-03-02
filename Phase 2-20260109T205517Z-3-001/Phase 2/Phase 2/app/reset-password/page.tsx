"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/atoms/button";
import FormInput from "@/components/atoms/form_input";
import Link from "next/link";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // TODO: Implement reset password API call
    // For now, simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[200px] md:h-[257px] flex flex-col items-center justify-center gap-4 md:gap-[27px] px-4 sm:px-8 md:px-20 lg:px-[303px] py-8 md:py-[47px]">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-white text-center">
          Reset Password
        </h1>
        <p className="text-xl sm:text-2xl md:text-[32px] text-white text-center font-['Hubballi']">
          Create Your New Password
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[50px] py-6 md:py-[46px]">
        {/* Header */}
        <div className="text-center mb-12 md:mb-[94px]">
          <h2 className="text-xl md:text-[24px] font-semibold text-primary-dark mb-2">
            Set New Password
          </h2>
          <p className="text-lg md:text-[20px] font-light text-primary-dark">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <div className="max-w-[600px] mx-auto">
          {!token ? (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-accent-light rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-primary-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-primary-dark mb-4">
                Invalid Reset Link
              </h3>
              <p className="text-base md:text-lg text-text-body mb-8">
                This password reset link is invalid or has expired. Please
                request a new one.
              </p>
              <Link href="/forgot-password">
                <Button type="primary">Request New Link</Button>
              </Link>
            </div>
          ) : isSuccess ? (
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
                Your password has been successfully reset. You will be
                redirected to the login page in a few seconds.
              </p>
              <Link href="/login">
                <Button type="primary">Go to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Error Message */}
              {error && (
                <div className="bg-accent-light border border-accent text-primary-dark px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Info Message */}
              <div className="bg-off-white border border-pale-blue text-primary-dark px-4 py-3 rounded-lg text-sm">
                Your new password must be at least 8 characters long and should
                include a mix of letters, numbers, and special characters.
              </div>

              {/* New Password */}
              <FormInput
                label="New Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />

              {/* Confirm Password */}
              <FormInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />

              {/* Submit Button */}
              <div className="mt-4">
                <Button
                  type="primary"
                  buttonType="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-primary-dark">Loading...</div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
