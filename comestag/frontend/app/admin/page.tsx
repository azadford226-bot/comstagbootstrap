"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /admin redirects to /admin/login for unauthenticated users.
 * Authenticated admin users will be redirected by the login page or dashboard.
 */
export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/login");
  }, [router]);

  return null;
}
