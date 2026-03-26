"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Globe, X, ShieldCheck } from "lucide-react";
import { getProfile, isOrganizationProfile } from "@/lib/api/profile";
import { listDomainVerifications } from "@/lib/domain-verification";

const DISMISS_KEY = "comestag_domain_verify_banner_dismissed";

function domainFromEmail(email: string): string | null {
  const m = email.trim().match(/@([^@]+)$/);
  return m ? m[1].toLowerCase() : null;
}

/**
 * Prompt org users to verify DNS for their email domain (trust + profile badge).
 */
export default function DomainVerificationBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const load = useCallback(async () => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") {
        setDismissed(true);
        return;
      }
    } catch {
      /* ignore */
    }

    const profileRes = await getProfile();
    if (!profileRes.success || !profileRes.data || !isOrganizationProfile(profileRes.data)) {
      setShow(false);
      return;
    }

    const email = profileRes.data.email;
    const domain = domainFromEmail(email);
    if (!domain) {
      setShow(false);
      return;
    }

    const listRes = await listDomainVerifications();
    if (listRes.success && Array.isArray(listRes.data)) {
      const verified = listRes.data.some(
        (d) => d.verified && d.domain.toLowerCase() === domain
      );
      setShow(!verified);
    } else {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (dismissed || !show) return null;

  return (
    <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50/80 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="p-2 rounded-lg bg-white border border-blue-100 shrink-0">
          <Globe className="w-5 h-5 text-blue-600" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 flex flex-wrap items-center gap-2">
            Verify your company domain
            <span className="inline-flex items-center gap-1 text-xs font-normal text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
              Builds trust on your profile
            </span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Add a DNS record to prove you control your domain. After verification, your domain can show as verified on
            your company profile.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/settings#domain-verification"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          Verify domain
        </Link>
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          aria-label="Dismiss"
          onClick={() => {
            try {
              localStorage.setItem(DISMISS_KEY, "1");
            } catch {
              /* ignore */
            }
            setDismissed(true);
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
