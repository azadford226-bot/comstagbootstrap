"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfile, isOrganizationProfile } from "@/lib/api/profile";
import { getAccessToken } from "@/lib/secure-storage";
import { organizationProfileCompletionPercent } from "@/lib/profile-completion";

const DISMISS_KEY = "comestag_profile_completion_bar_dismissed";

/** Thin progress indicator for org users until profile is sufficiently complete */
export default function ProfileCompletionBar() {
  const [pct, setPct] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") setHidden(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (hidden) return;
    if (!getAccessToken()) {
      setPct(null);
      return;
    }
    getProfile()
      .then((res) => {
        if (res.success && res.data && isOrganizationProfile(res.data)) {
          setPct(organizationProfileCompletionPercent(res.data));
        } else {
          setPct(null);
        }
      })
      .catch(() => setPct(null));
  }, [hidden]);

  if (hidden || pct === null || pct >= 80) return null;

  return (
    <div className="flex items-center gap-2 min-w-0 max-w-[200px] lg:max-w-[240px]">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="text-[10px] font-medium text-gray-600 truncate">Profile</span>
          <span className="text-[10px] text-primary font-semibold">{pct}%</span>
        </div>
        <div
          className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Profile ${pct}% complete`}
        >
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <Link
        href="/profile/edit"
        className="text-[10px] font-semibold text-primary whitespace-nowrap hover:underline"
      >
        Complete
      </Link>
      <button
        type="button"
        className="text-xs text-gray-400 hover:text-gray-600 px-0.5"
        aria-label="Dismiss profile progress"
        onClick={() => {
          try {
            localStorage.setItem(DISMISS_KEY, "1");
          } catch {
            /* ignore */
          }
          setHidden(true);
        }}
      >
        ×
      </button>
    </div>
  );
}
