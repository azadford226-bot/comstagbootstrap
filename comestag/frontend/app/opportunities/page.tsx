"use client";

import { useState, useEffect, useCallback } from "react";
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
  Sparkles,
  Plus,
  X,
  Loader2,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  listOpportunities,
  expressInterest,
  withdrawInterest,
  createOpportunity,
  type Opportunity,
  type CreateOpportunityRequest,
} from "@/lib/api/opportunities";
import { bookmarkItem, unbookmarkItem, getBookmarks } from "@/lib/api/social";

type OpportunityType = "all" | "jv" | "incubation" | "funding" | "codev";

const TABS: { key: OpportunityType; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All", icon: <Briefcase className="w-4 h-4" /> },
  { key: "jv", label: "Joint Ventures", icon: <Handshake className="w-4 h-4" /> },
  { key: "incubation", label: "Incubation", icon: <Rocket className="w-4 h-4" /> },
  { key: "funding", label: "Funding Rounds", icon: <Banknote className="w-4 h-4" /> },
  { key: "codev", label: "Co-Development", icon: <Code2 className="w-4 h-4" /> },
];

function TypeBadge({ type }: { type: string }) {
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

function formatDate(dateStr: string | null) {
  if (!dateStr) return "No deadline";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState<OpportunityType>("all");
  const [search, setSearch] = useState("");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<CreateOpportunityRequest>({
    title: "",
    description: "",
    type: "jv",
    company: "",
    location: "",
    equity: "",
    funding: "",
    stage: "",
    tags: [],
    cohortDetails: "",
    milestones: "",
    duration: "",
  });
  const [tagInput, setTagInput] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [res, bookmarksRes] = await Promise.all([
        listOpportunities(activeTab),
        getBookmarks("OPPORTUNITY"),
      ]);
      if (res.success && res.data) {
        setOpportunities(res.data.content);
      }
      if (bookmarksRes.success && bookmarksRes.data) {
        setSavedIds(new Set(bookmarksRes.data.content.map((b) => b.targetId)));
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = opportunities.filter((op) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      op.title.toLowerCase().includes(q) ||
      (op.company || "").toLowerCase().includes(q) ||
      (op.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleExpressInterest = async (op: Opportunity) => {
    try {
      if (op.hasExpressedInterest) {
        await withdrawInterest(op.id);
      } else {
        await expressInterest(op.id);
      }
      setOpportunities((prev) =>
        prev.map((o) =>
          o.id === op.id
            ? {
                ...o,
                hasExpressedInterest: !o.hasExpressedInterest,
                interestCount: o.hasExpressedInterest
                  ? Math.max(0, o.interestCount - 1)
                  : o.interestCount + 1,
              }
            : o
        )
      );
    } catch { /* ignore */ }
  };

  const toggleSave = async (id: string) => {
    try {
      if (savedIds.has(id)) {
        await unbookmarkItem("OPPORTUNITY", id);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        await bookmarkItem("OPPORTUNITY", id);
        setSavedIds((prev) => new Set(prev).add(id));
      }
    } catch { /* ignore */ }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.description) return;
    setCreating(true);
    try {
      const res = await createOpportunity({
        ...formData,
        tags: formData.tags && formData.tags.length > 0 ? formData.tags : undefined,
      });
      if (res.success) {
        setShowCreate(false);
        setFormData({ title: "", description: "", type: "jv", company: "", location: "", equity: "", funding: "", stage: "", tags: [], cohortDetails: "", milestones: "", duration: "" });
        fetchData();
      }
    } catch { /* ignore */ }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-b from-primary-dark via-[#3f64c4] to-primary-dark py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Opportunities Hub
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Discover joint ventures, incubation programs, funding rounds, and co-development partnerships.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search + Create */}
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
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Post Opportunity
          </button>
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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6">
                <Skeleton className="h-5 w-24 mb-3" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No opportunities found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters or be the first to post one.</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
            >
              Post an Opportunity
            </button>
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
                      {op.status === "open" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <Sparkles className="w-3 h-3" />
                          {op.interestCount} interested
                        </span>
                      )}
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
                    <span>{op.company || "Anonymous"}</span>
                    {op.company && <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />}
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {op.description}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                    {op.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {op.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(op.createdAt)}
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

                  {/* Co-dev / Incubation extra details */}
                  {(op.cohortDetails || op.milestones || op.duration) && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg text-xs space-y-1.5">
                      {op.duration && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="font-medium">Duration:</span> {op.duration}
                        </div>
                      )}
                      {op.cohortDetails && (
                        <div className="text-gray-600">
                          <span className="font-medium">{op.type === "incubation" ? "Cohort:" : "Pilot:"}</span> {op.cohortDetails}
                        </div>
                      )}
                      {op.milestones && (
                        <div className="text-gray-500">
                          <span className="font-medium">Milestones:</span> {op.milestones}
                        </div>
                      )}
                    </div>
                  )}

                  {op.tags && op.tags.length > 0 && (
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
                  )}

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleExpressInterest(op)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        op.hasExpressedInterest
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "text-white bg-primary hover:bg-primary-dark"
                      }`}
                    >
                      {op.hasExpressedInterest ? "Interested" : "Express Interest"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/messages?rfq=${op.id}&subject=${encodeURIComponent(op.title)}`}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Discuss
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-semibold">Post an Opportunity</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g. Cloud Infrastructure Joint Venture"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="jv">Joint Venture</option>
                  <option value="incubation">Incubation</option>
                  <option value="funding">Funding Round</option>
                  <option value="codev">Co-Development</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Describe the opportunity..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    value={formData.company || ""}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="e.g. Remote / Singapore"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Equity / Terms</label>
                  <input
                    value={formData.equity || ""}
                    onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="e.g. 50/50 split"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Funding</label>
                  <input
                    value={formData.funding || ""}
                    onChange={(e) => setFormData({ ...formData, funding: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="e.g. $5M target"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <input
                  value={formData.stage || ""}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g. Series A, Pre-Seed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration / Timeline</label>
                <input
                  value={formData.duration || ""}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g. 6 months, Q3-Q4 2026"
                />
              </div>
              {(formData.type === "incubation" || formData.type === "codev") && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.type === "incubation" ? "Cohort Details" : "Pilot Program Details"}
                    </label>
                    <textarea
                      value={formData.cohortDetails || ""}
                      onChange={(e) => setFormData({ ...formData, cohortDetails: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder={formData.type === "incubation" ? "e.g. Batch 5 — 10 startups, mentoring, $50K seed..." : "e.g. Scope, deliverables, success criteria..."}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Milestones</label>
                    <textarea
                      value={formData.milestones || ""}
                      onChange={(e) => setFormData({ ...formData, milestones: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g. Week 4: MVP → Week 8: Pilot launch → Week 12: Demo Day"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && tagInput.trim()) {
                        e.preventDefault();
                        setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
                        setTagInput("");
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Press Enter to add tags"
                  />
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md">
                        {tag}
                        <button onClick={() => setFormData({ ...formData, tags: formData.tags?.filter((_, j) => j !== i) })}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !formData.title || !formData.description}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors text-sm font-medium"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                {creating ? "Posting..." : "Post Opportunity"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
