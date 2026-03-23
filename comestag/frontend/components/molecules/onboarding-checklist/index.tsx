"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Circle,
  Upload,
  Building2,
  FileText,
  MessageCircle,
  Briefcase,
  ChevronRight,
  X,
} from "lucide-react";
import { OrganizationProfile } from "@/lib/api/profile";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  done: boolean;
  href: string;
  icon: React.ReactNode;
}

interface OnboardingChecklistProps {
  profile: OrganizationProfile | null;
  postsCount: number;
  onDismiss: () => void;
}

export default function OnboardingChecklist({
  profile,
  postsCount,
  onDismiss,
}: OnboardingChecklistProps) {
  const items: ChecklistItem[] = useMemo(() => {
    if (!profile) return [];
    return [
      {
        id: "photo",
        label: "Add profile photo",
        description: "Help others recognise your company",
        done: !!(profile.profileImageId || profile.profileImage),
        href: "/profile/edit",
        icon: <Upload className="w-4 h-4" />,
      },
      {
        id: "cover",
        label: "Upload cover image",
        description: "Brand your company page",
        done: !!(profile.profileCoverId || profile.coverImage),
        href: "/profile/edit",
        icon: <Upload className="w-4 h-4" />,
      },
      {
        id: "about",
        label: "Complete company description",
        description: "Tell visitors who you are and what you do",
        done: !!(profile.whoWeAre && profile.whatWeDo),
        href: "/profile/edit",
        icon: <Building2 className="w-4 h-4" />,
      },
      {
        id: "website",
        label: "Add website URL",
        description: "Link to your company site",
        done: !!profile.website,
        href: "/profile/edit",
        icon: <Building2 className="w-4 h-4" />,
      },
      {
        id: "post",
        label: "Publish your first post",
        description: "Share an update with the community",
        done: postsCount > 0,
        href: "/dashboard",
        icon: <FileText className="w-4 h-4" />,
      },
      {
        id: "rfq",
        label: "Post or browse an RFQ",
        description: "Find opportunities or request quotes",
        done: false,
        href: "/rfq",
        icon: <Briefcase className="w-4 h-4" />,
      },
      {
        id: "message",
        label: "Send your first message",
        description: "Start a conversation with a partner",
        done: false,
        href: "/messages",
        icon: <MessageCircle className="w-4 h-4" />,
      },
    ];
  }, [profile, postsCount]);

  const completed = items.filter((i) => i.done).length;
  const total = items.length;
  const pct = Math.round((completed / total) * 100);

  if (completed === total) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Get started with Comstag
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {completed} of {total} complete
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-3">
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">{pct}%</p>
      </div>

      <div className="px-3 pb-3 pt-1">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors ${
              item.done
                ? "opacity-60"
                : "hover:bg-gray-50"
            }`}
          >
            {item.done ? (
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm ${
                  item.done
                    ? "text-gray-400 line-through"
                    : "text-gray-800 font-medium"
                }`}
              >
                {item.label}
              </p>
              {!item.done && (
                <p className="text-xs text-gray-400">{item.description}</p>
              )}
            </div>
            {!item.done && (
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
