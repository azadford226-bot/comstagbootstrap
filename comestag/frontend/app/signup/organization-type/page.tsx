"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Code2,
  Rocket,
  Landmark,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import type { CompanyType } from "@/lib/api/auth";

const ROLES: {
  type: CompanyType;
  title: string;
  subtitle: string;
  icon: ReactNode;
}[] = [
  {
    type: "ENTERPRISE",
    title: "Enterprise",
    subtitle: "Source vendors, run RFQs, and scale procurement across teams.",
    icon: <Building2 className="w-8 h-8 text-blue-600" />,
  },
  {
    type: "VENDOR",
    title: "Software vendor",
    subtitle: "List capabilities, respond to RFQs, and win enterprise clients.",
    icon: <Code2 className="w-8 h-8 text-emerald-600" />,
  },
  {
    type: "STARTUP",
    title: "Startup",
    subtitle: "Show traction, find pilots, incubators, and investors.",
    icon: <Rocket className="w-8 h-8 text-orange-600" />,
  },
  {
    type: "INVESTOR",
    title: "Investor",
    subtitle: "Review deal flow, funding rounds, and joint ventures.",
    icon: <Landmark className="w-8 h-8 text-violet-600" />,
  },
  {
    type: "SERVICE_PROVIDER",
    title: "Service provider",
    subtitle: "Consulting, integration, and delivery partners.",
    icon: <Briefcase className="w-8 h-8 text-cyan-600" />,
  },
];

export default function OrganizationTypePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-gradient-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[160px] md:min-h-[200px] flex flex-col items-center justify-center gap-2 px-4 py-8">
        <h1 className="text-2xl sm:text-3xl md:text-[36px] font-semibold text-white text-center">
          How will you use ComStag?
        </h1>
        <p className="text-white/90 text-center text-sm md:text-base max-w-xl">
          Choose the role that best fits your organization. You can still collaborate across all opportunity types later.
        </p>
      </div>

      <div className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        <button
          type="button"
          onClick={() => router.push("/signup-select")}
          className="inline-flex items-center gap-2 text-sm text-primary-dark hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to account type
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {ROLES.map((role) => (
            <button
              key={role.type}
              type="button"
              onClick={() =>
                router.push(`/signup?companyType=${encodeURIComponent(role.type)}`)
              }
              className="text-left border-2 border-light-gray rounded-xl p-6 hover:border-primary hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gray-50 shrink-0">{role.icon}</div>
                <div>
                  <h2 className="text-lg font-semibold text-primary-dark mb-1">{role.title}</h2>
                  <p className="text-sm text-text-body leading-snug">{role.subtitle}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          Wrong path?{" "}
          <Link href="/signup-consumer" className="text-primary font-medium hover:underline">
            Register as an individual / consumer
          </Link>{" "}
          instead.
        </p>
      </div>
    </div>
  );
}
