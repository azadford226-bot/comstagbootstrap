"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on messages and dashboard pages
  const hideFooter = pathname === "/messages" || pathname === "/dashboard";
  
  if (hideFooter) {
    return null;
  }
  
  return <Footer />;
}
