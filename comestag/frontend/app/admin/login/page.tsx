"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/button";
import FormInput from "@/components/atoms/form_input";
import { login, verifyLoginCode } from "@/lib/api/auth";
import {
  setAccessToken,
  setRefreshToken,
  setUserEmail,
  setUserName,
  setUserType,
} from "@/lib/secure-storage";

const QUICK_LOGINS = {
  admin: {
    email: "admin@comstag.com",
    password: "Admin@123!",
    displayName: "System Administrator",
    userType: "ADMIN" as const,
    redirect: "/admin/dashboard",
  },
  company: {
    email: "tester@comstag.com",
    password: "Test@123!",
    displayName: "Test Company",
    userType: "ORGANIZATION" as const,
    redirect: "/dashboard",
  },
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuickLogin = async (accountKey: keyof typeof QUICK_LOGINS) => {
    const creds = QUICK_LOGINS[accountKey];
    setIsLoading(true);
    setLoadingAccount(accountKey);
    setError(null);

    setFormData({ email: creds.email, password: creds.password });

    try {
      const result = await login({ email: creds.email, password: creds.password });

      if (result.success && result.data) {
        if (result.data.accessToken && result.data.refreshToken) {
          setAccessToken(result.data.accessToken);
          setRefreshToken(result.data.refreshToken);
          setUserEmail(creds.email);
          setUserName(creds.displayName);
          setUserType(creds.userType);
          window.dispatchEvent(new Event("storage"));
          router.push(creds.redirect);
        } else {
          setUserId(result.data.userId || null);
          setIsCodeSent(true);
        }
      } else {
        setError(result.message || "Login failed. Account may not exist.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setIsLoading(false);
      setLoadingAccount(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(formData);
      if (result.success && result.data) {
        // Check if this is an ADMIN login with tokens
        if (result.data.accessToken && result.data.refreshToken) {
          // ADMIN login - tokens received directly, no verification needed
          setAccessToken(result.data.accessToken);
          setRefreshToken(result.data.refreshToken);
          setUserEmail(formData.email);
          setUserName("Admin"); // Default name, will be updated from profile if available
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

          window.dispatchEvent(new Event("storage"));
          router.push("/admin/dashboard");
        } else {
          // Regular flow - needs verification code
          setUserId(result.data.userId || null);
          setIsCodeSent(true);
        }
      } else {
        setError(result.message || "Login failed. Please check your credentials and ensure the backend is running.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to the server. Please ensure the backend is running on http://localhost:3000");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!userId) {
      setError("User ID not found. Please try logging in again.");
      setIsLoading(false);
      return;
    }

    // Identifier format must be: userId_code (where userId is UUID)
    const identifier = `${userId}_${verificationCode}`;
    
    const result = await verifyLoginCode({
      identifier,
    });

    if (result.success && result.data) {
      setAccessToken(result.data.accessToken);
      setRefreshToken(result.data.refreshToken);
      setUserEmail(formData.email);
      setUserName("Admin"); // Default name, will be updated from profile if available
      setUserType("ADMIN"); // Admin login always sets ADMIN type
      
      // Fetch profile to get actual display name
      try {
        const profileResponse = await fetch("/v1/profile", {
          headers: {
            Authorization: `Bearer ${result.data.accessToken}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userProfile = profileData.userDetails || profileData;
          
          // Update display name if available
          if (userProfile.displayName) {
            setUserName(userProfile.displayName);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        // Continue anyway - we have the essential info
      }
      
      window.dispatchEvent(new Event("storage"));
      router.push("/admin/dashboard");
    } else {
      setError(result.message || "Verification failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark via-[#3f64c4] to-primary-dark px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-dark mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600">
            {isCodeSent
              ? "Enter verification code"
              : "Sign in to admin dashboard"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Quick Login Buttons */}
        {!isCodeSent && (
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
            >
              {loadingAccount === "admin" ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )}
              <div className="text-left">
                <div className="font-semibold">Admin Login</div>
                <div className="text-xs text-blue-200">admin@comstag.com &middot; Full dashboard access</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("company")}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
            >
              {loadingAccount === "company" ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
              <div className="text-left">
                <div className="font-semibold">Test Company Login</div>
                <div className="text-xs text-emerald-200">tester@comstag.com &middot; Company dashboard</div>
              </div>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-400">or sign in manually</span>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={isCodeSent ? handleVerifyCode : handleSubmit}
          className="space-y-4"
        >
          {!isCodeSent ? (
            <>
              <FormInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@comstag.com"
                required
              />
              <FormInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
            </>
          ) : (
            <FormInput
              label="Verification Code"
              type="text"
              name="code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              required
              maxLength={6}
            />
          )}

          <Button
            buttonType="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : isCodeSent
              ? "Verify Code"
              : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
