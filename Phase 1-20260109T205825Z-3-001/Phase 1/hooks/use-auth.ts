"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth/logout";

interface User {
  email: string;
  name: string;
  accessToken: string;
}

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem("accessToken");
      const userEmail = localStorage.getItem("userEmail");
      const userName = localStorage.getItem("userName");

      if (!accessToken || !userEmail || !userName) {
        if (requireAuth) {
          router.push("/login");
        }
        setIsLoading(false);
        return;
      }

      setUser({
        email: userEmail,
        name: userName,
        accessToken,
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
    email: string
  ) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", email.split("@")[0]);

    setUser({
      email,
      name: email.split("@")[0],
      accessToken,
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
