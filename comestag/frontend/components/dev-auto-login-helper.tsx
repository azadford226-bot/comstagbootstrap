"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { initDevAuth, isDevMode } from "@/lib/dev-auth";
import { useAuth } from "@/hooks/use-auth";
import { Shield, Building2, LogIn, X, ChevronDown } from "lucide-react";

/**
 * Dev Auto-Login Helper Component
 * 
 * This component provides a quick way to auto-login as Admin or Company in dev mode.
 * Only visible when:
 * - Dev mode is enabled (NEXT_PUBLIC_DEV_MODE=true)
 * - User is not already logged in
 * - On any page
 */
export default function DevAutoLoginHelper() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  // Debug logging
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("[DevAutoLoginHelper] Debug:", {
        isDevMode: isDevMode(),
        isAuthenticated,
        isDismissed,
        showHelper: !isDismissed && isDevMode() && !isAuthenticated,
        NEXT_PUBLIC_DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE,
      });
    }
  }, [isAuthenticated, isDismissed]);
  
  const showHelper = !isDismissed && isDevMode() && !isAuthenticated;

  const handleAutoLogin = (userType: "ADMIN" | "ORGANIZATION") => {
    setIsLoggingIn(true);
    
    // Initialize dev auth with selected type
    const success = initDevAuth(userType);
    
    if (success) {
      // Wait a bit for state to update
      setTimeout(() => {
        if (userType === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
        setIsLoggingIn(false);
        setShowOptions(false);
      }, 500);
    } else {
      setIsLoggingIn(false);
    }
  };

  if (!showHelper) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gradient-to-br from-yellow-400 to-yellow-500 text-black rounded-xl shadow-2xl p-4 max-w-sm border-2 border-yellow-600">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-yellow-600 rounded-lg flex-shrink-0">
          <LogIn className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm mb-1">🔧 Dev Mode: Quick Login</h3>
          <p className="text-xs mb-3 text-gray-800">
            Choose a user type to auto-login for testing.
          </p>
          
          {!showOptions ? (
            <button
              onClick={() => setShowOptions(true)}
              disabled={isLoggingIn}
              className="w-full bg-black text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              <ChevronDown className="w-4 h-4" />
              Choose Login Type
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => handleAutoLogin("ADMIN")}
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Login as Admin
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleAutoLogin("ORGANIZATION")}
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4" />
                    Login as Company
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowOptions(false)}
                disabled={isLoggingIn}
                className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-black hover:text-gray-800 flex-shrink-0 transition-colors"
          aria-label="Close"
          disabled={isLoggingIn}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
