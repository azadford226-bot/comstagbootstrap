"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { initDevAuth, isDevMode } from "@/lib/dev-auth";
import { canUseAutoLogin } from "@/lib/admin-auto-login";
import { useAuth } from "@/hooks/use-auth";
import { Shield, LogIn, X } from "lucide-react";

/**
 * Admin Auto-Login Helper Component
 * 
 * This component provides a quick way to auto-login as admin in dev mode.
 * Only visible when:
 * - Dev mode is enabled (NEXT_PUBLIC_DEV_MODE=true)
 * - User is not already logged in as admin
 * - On admin pages
 */
export default function AdminAutoLoginHelper() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const isAdminPage = pathname.startsWith("/admin") || pathname === "/";
  const showHelper =
    !isDismissed &&
    isDevMode() &&
    canUseAutoLogin() &&
    isAdminPage &&
    (!isAuthenticated || user?.userType !== "ADMIN");

  const handleAutoLogin = () => {
    setIsLoggingIn(true);
    
    // Initialize dev auth as admin
    const success = initDevAuth("ADMIN");
    
    if (success) {
      // Wait a bit for state to update
      setTimeout(() => {
        router.push("/admin/dashboard");
        setIsLoggingIn(false);
      }, 500);
    } else {
      setIsLoggingIn(false);
    }
  };

  if (!showHelper) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-yellow-500 text-black rounded-lg shadow-lg p-4 max-w-sm border-2 border-yellow-600">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-bold text-sm mb-1">🔧 Dev Mode: Admin Auto-Login</h3>
          <p className="text-xs mb-3">
            Click below to automatically login as admin for testing.
          </p>
          <button
            onClick={handleAutoLogin}
            disabled={isLoggingIn}
            className="w-full bg-black text-white px-3 py-2 rounded text-xs font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoggingIn ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Auto-Login as Admin
              </>
            )}
          </button>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-black hover:text-gray-800 flex-shrink-0"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
