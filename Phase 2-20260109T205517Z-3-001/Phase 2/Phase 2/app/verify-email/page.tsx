"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail, sendVerificationCode } from "@/lib/api/auth";
import { logger } from "@/lib/logger";
import Button from "@/components/atoms/button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    const identifier = searchParams.get("identifier");

    const verify = async () => {
      logger.info("Email verification started", {
        hasIdentifier: !!identifier,
      });

      if (!identifier) {
        setStatus("error");
        setMessage("Invalid verification link. No identifier found.");
        return;
      }

      // Call the verification API
      const result = await verifyEmail({ identifier });

      logger.info("Email verification completed", { success: result.success });

      if (result.success) {
        setStatus("success");
        setMessage(
          result.message || "Your email has been verified successfully!"
        );
      } else {
        setStatus("error");
        setMessage(
          result.message ||
            "Email verification failed. The link may be invalid or expired."
        );
      }
    };

    verify();
  }, [searchParams]);

  const handleResendVerification = async () => {
    const identifier = searchParams.get("identifier");

    if (!identifier) {
      setResendMessage("Unable to resend verification. Invalid identifier.");
      return;
    }

    // Extract the actual identifier (remove the random key suffix)
    const actualIdentifier = identifier.split("_")[0];

    setIsResending(true);
    setResendMessage("");

    logger.info("Resending verification code", {
      identifier: actualIdentifier,
    });

    const result = await sendVerificationCode({
      identifier: actualIdentifier,
      verificationType: "EMAIL",
    });

    setIsResending(false);

    if (result.success) {
      setResendMessage(
        "Verification code sent successfully! Please check your email."
      );
      logger.info("Verification code resent successfully");
    } else {
      setResendMessage(
        result.message ||
          "Failed to resend verification code. Please try again."
      );
      logger.error("Failed to resend verification code", result.message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
            <h1 className="text-2xl font-semibold text-primary-dark mb-4">
              Verifying Your Email
            </h1>
            <p className="text-text-body">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-500"
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
            <h1 className="text-2xl font-semibold text-primary-dark mb-4">
              Email Verified!
            </h1>
            <p className="text-text-body mb-8">{message}</p>
            <Button
              type="primary"
              onClick={() => router.push("/login")}
              buttonType="button"
              fullWidth
            >
              Continue to Login
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-500"
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
            <h1 className="text-2xl font-semibold text-primary-dark mb-4">
              Verification Failed
            </h1>
            <p className="text-text-body mb-4">{message}</p>
            {resendMessage && (
              <p
                className={`text-sm mb-4 ${
                  resendMessage.includes("successfully")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {resendMessage}
              </p>
            )}
            <div className="flex flex-col gap-4">
              <Button
                type="primary"
                onClick={handleResendVerification}
                buttonType="button"
                fullWidth
                disabled={isResending}
              >
                {isResending ? "Sending..." : "Resend Verification Code"}
              </Button>
              <Button
                type="secondary"
                onClick={() => router.push("/")}
                buttonType="button"
                fullWidth
              >
                Back to Home
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
