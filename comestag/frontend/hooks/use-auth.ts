"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth/logout";
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  getUserEmail,
  setUserEmail,
  getUserName,
  setUserName,
  getUserType,
  setUserType,
} from "@/lib/secure-storage";

interface User {
  email: string;
  name: string;
  accessToken: string;
  userType: string | null;
}

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getAccessToken();
      const userEmail = getUserEmail();
      const userName = getUserName();
      let userType = getUserType();

      if (!accessToken || !userEmail || !userName) {
        if (requireAuth) {
          router.push("/login");
        }
        setIsLoading(false);
        return;
      }

      // If userType is missing, fetch it from profile
      if (!userType && accessToken) {
        try {
          const profileResponse = await fetch("/v1/profile", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const userProfile = profileData.userDetails || profileData;

            // Determine user type from profile
            if (userProfile.size || userProfile.whoWeAre) {
              // Organization profile has size and whoWeAre fields
              userType = "ORGANIZATION";
              setUserType("ORGANIZATION");
            } else if (userProfile.interests) {
              // Consumer profile has interests field
              userType = "CONSUMER";
              setUserType("CONSUMER");
            }
            
            // Update display name if available
            if (userProfile.displayName) {
              setUserName(userProfile.displayName);
            }
          }
        } catch (err) {
          console.error("Failed to fetch profile for user type:", err);
        }
      }

      setUser({
        email: userEmail,
        name: userName,
        accessToken,
        userType,
      });
      setIsLoading(false);
    };

    checkAuth();
  }, [router, requireAuth]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const setAuthData = (
    accessToken: string,
    refreshToken: string,
    email: string,
    type?: string
  ) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserEmail(email);
    setUserName(email.split("@")[0]);
    if (type) {
      setUserType(type);
    }

    setUser({
      email,
      name: email.split("@")[0],
      accessToken,
      userType: type || getUserType(),
    });
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: handleLogout,
    setAuthData,
  };
}
