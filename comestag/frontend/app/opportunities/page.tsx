"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Handshake,
  Rocket,
  Banknote,
  Code2,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  ArrowRight,
  Briefcase,
  Building2,
  BadgeCheck,
  BookmarkPlus,
  Phone,
  Heart,
} from "lucide-react";

type OpportunityType = "all" | "jv" | "incubation" | "funding" | "codev";

interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  company: string;
  description: string;
  location: string;
  posted: string;
  tags: string[];
  equity?: string;
  funding?: string;
  stage?: string;
  status: "open" | "closing_soon" | "closed";
}

const TABS: { key: OpportunityType; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "all", label: "All", icon: <Briefcase className="w-4 h-4" />, color: "blue" },
  { key: "jv", label: "Joint Ventures", icon: <Handshake className="w-4 h-4" />, color: "indigo" },
  { key: "incubation", label: "Incubation", icon: <Rocket className="w-4 h-4" />, color: "purple" },
  { key: "funding", label: "Funding Rounds", icon: <Banknote className="w-4 h-4" />, color: "emerald" },
  { key: "codev", label: "Co-Development", icon: <Code2 className="w-4 h-4" />, color: "amber" },
];

const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: "1",
    title: "Cloud Infrastructure Joint Venture — APAC Expansion",
    type: "jv",
    company: "NexTech Global",
    description: "Seeking a partner with strong APAC distribution channels to co-build a managed cloud infrastructure offering. Equal equity split with shared R&D costs.",
    location: "Singapore / Remote",
    posted: "2 days ago",
    tags: ["Cloud", "Infrastructure", "APAC"],
    equity: "50/50 equity split",
    status: "open",
  },
  {
    id: "2",
    title: "AI-Powered Supply Chain Startup — Cohort 5",
    type: "incubation",
    company: "Comstag Ventures",
    description: "12-week incubation program for early-stage startups building AI solutions for supply chain optimization. Includes $50K seed funding, mentorship, and demo day.",
    location: "Global (Remote-first)",
    posted: "5 days ago",
    tags: ["AI", "Supply Chain", "Incubation"],
    funding: "$50K seed",
    stage: "Pre-Seed",
    status: "open",
  },
  {
    id: "3",
    title: "Series A — Enterprise DevOps Platform",
    type: "funding",
    company: "PipelineOps Inc.",
    description: "Raising $5M Series A for our enterprise DevOps platform. 3x YoY growth, 150+ enterprise clients. Looking for strategic investors with SaaS expertise.",
    location: "San Francisco, CA",
    posted: "1 week ago",
    tags: ["DevOps", "SaaS", "Enterprise"],
    funding: "$5M target",
    stage: "Series A",
    status: "open",
  },
  {
    id: "4",
    title: "Co-Development: EV Battery Management System",
    type: "codev",
    company: "GreenDrive Labs",
    description: "Looking for a software partner to co-develop next-gen battery management firmware. IP shared proportionally based on contribution.",
    location: "Munich, Germany",
    posted: "3 days ago",
    tags: ["EV", "Firmware", "IoT"],
    status: "open",
  },
  {
    id: "5",
    title: "Fintech API Integration Partnership",
    type: "jv",
    company: "PayStream Solutions",
    description: "Joint venture to build a unified fintech API layer connecting regional payment systems. Revenue share model with technical co-ownership.",
    location: "London, UK",
    posted: "1 day ago",
    tags: ["Fintech", "API", "Payments"],
    equity: "Revenue share",
    status: "closing_soon",
  },
  {
    id: "6",
    title: "Healthcare AI Accelerator — Batch 8",
    type: "incubation",
    company: "MedTech Accelerate",
    description: "6-month accelerator for healthcare AI startups. $100K investment, clinical trial access, regulatory guidance, and hospital network partnerships.",
    location: "Boston, MA",
    posted: "2 weeks ago",
    tags: ["Healthcare", "AI", "Accelerator"],
    funding: "$100K investment",
    stage: "Seed",
    status: "open",
  },
];

function TypeBadge({ type }: { type: OpportunityType }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    jv: { bg: "bg-indigo-50", text: "text-indigo-700", label: "Joint Venture" },
    incubation: { bg: "bg-purple-50", text: "text-purple-700", label: "Incubation" },
    funding: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Funding" },
    codev: { bg: "bg-amber-50", text: "text-amber-700", label: "Co-Development" },
  };
  const c = config[type] || config.jv;
  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "closing_soon") {
    return (
      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-50 text-orange-600">
        Closing Soon
      </span>
    );
  }
  if (status === "closed") {
    return (
      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
        Closed
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-600">
      Open
    </span>
  );
}

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState<OpportunityType>("all");
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const filtered = SAMPLE_OPPORTUNITIES.filter((op) => {
    const matchesTab = activeTab === "all" || op.type === activeTab;
    const matchesSearch =
      !search ||
      op.title.toLowerCase().includes(search.toLowerCase()) ||
      op.company.toLowerCase().includes(search.toLowerCase()) ||
      op.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-b from-primary-dark via-[#3f64c4] to-primary-dark py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Opportunities Hub
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Discover joint ventures, incubation programs, funding rounds, and co-development partnerships.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search + Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No opportunities found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((op) => (
              <div
                key={op.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <TypeBadge type={op.type} />
                      <StatusBadge status={op.status} />
                    </div>
                    <button
                      onClick={() => toggleSave(op.id)}
                      className={`p-1.5 rounded-md transition-colors ${
                        savedIds.has(op.id)
                          ? "text-primary bg-primary/10"
                          : "text-gray-400 hover:text-primary hover:bg-primary/5"
                      }`}
                      title={savedIds.has(op.id) ? "Saved" : "Save"}
                    >
                      {savedIds.has(op.id) ? (
                        <Heart className="w-4 h-4 fill-current" />
                      ) : (
                        <BookmarkPlus className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    {op.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{op.company}</span>
                    {op.company && <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />}
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {op.description}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {op.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {op.posted}
                    </span>
                    {op.equity && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {op.equity}
                      </span>
                    )}
                    {op.funding && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {op.funding}
                      </span>
                    )}
                    {op.stage && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                        {op.stage}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {op.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-gray-50 text-gray-600 rounded-md border border-gray-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
                      Express Interest
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <Phone className="w-3.5 h-3.5" />
                      Schedule Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
