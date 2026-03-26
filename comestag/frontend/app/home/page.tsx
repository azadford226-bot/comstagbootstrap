"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { getUserType } from "@/lib/secure-storage";

/**
 * Signed-in landing: choose a sensible default route by role.
 * Marketing homepage stays at `/`.
 */
export default function HomeHubPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    const t = user.userType || getUserType();
    if (t === "CONSUMER") {
      router.replace("/consumer-profile");
      return;
    }
    router.replace("/dashboard");
  }, [user, isLoading, router]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center bg-gray-50">
      <div className="text-sm text-gray-500">Loading your workspace…</div>
    </div>
  );
}
