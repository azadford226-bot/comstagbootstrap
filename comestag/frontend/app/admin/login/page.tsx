"use client";

import { useState, useEffect } from "react";
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

// Test admin credentials for quick login
const TEST_ADMIN_CREDENTIALS = {
  email: "admin@comstag.com",
  password: "Admin123!",
  displayName: "Admin User"
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
  const [error, setError] = useState<string | null>(null);
  const [isDevelopment, setIsDevelopment] = useState(false);

  // Check if in development mode
  useEffect(() => {
    setIsDevelopment(process.env.NODE_ENV === 'development' || 
                     process.env.NEXT_PUBLIC_DEV_MODE === 'true');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuickAdminLogin = async () => {
    setIsLoading(true);
    setError(null);

    // Fill in test credentials
    setFormData({
      email: TEST_ADMIN_CREDENTIALS.email,
      password: TEST_ADMIN_CREDENTIALS.password,
    });

    try {
      const result = await login({
        email: TEST_ADMIN_CREDENTIALS.email,
        password: TEST_ADMIN_CREDENTIALS.password,
      });
      
      if (result.success && result.data) {
        // Check if this is an ADMIN login with tokens
        if (result.data.accessToken && result.data.refreshToken) {
          // ADMIN login - tokens received directly, no verification needed
          setAccessToken(result.data.accessToken);
          setRefreshToken(result.data.refreshToken);
          setUserEmail(TEST_ADMIN_CREDENTIALS.email);
          setUserName(TEST_ADMIN_CREDENTIALS.displayName);
          setUserType("ADMIN");
          window.dispatchEvent(new Event("storage"));
          router.push("/admin/dashboard");
        } else {
          // Regular flow - needs verification code
          setUserId(result.data.userId || null);
          setIsCodeSent(true);
        }
      } else {
        setError(result.message || "Test admin login failed. The admin account might not exist yet.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to the server. Please ensure the backend is running on http://localhost:3000");
    } finally {
      setIsLoading(false);
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
        <div className="text-center mb-8">
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

          {/* Test Admin Login Button - Development Only */}
          {isDevelopment && !isCodeSent && (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 border-2 border-yellow-500 bg-yellow-50 text-yellow-800 rounded-lg font-medium hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Admin Login
              </button>
              <p className="text-xs text-center text-gray-500 mt-2">
                Development Mode: Auto-fill admin credentials
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
