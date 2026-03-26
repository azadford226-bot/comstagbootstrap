"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import Image from "next/image";
import { Building2, MapPin, Globe, Calendar, Briefcase, TrendingUp, Users, FileText, ArrowRight, Clock, DollarSign, Search, Megaphone, SlidersHorizontal, X, Sparkles } from "lucide-react";
import { getProfile, OrganizationProfile, isOrganizationProfile } from "@/lib/api/profile";
import { getPosts, Post } from "@/lib/api/posts";
import { listRfqs, Rfq } from "@/lib/api/rfq";
import { authenticatedGet } from "@/lib/api/api-client";
import { PostsFeed } from "@/components/ui/posts-feed";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { getMediaUrl } from "@/lib/api/media";
import { getFollowingIds, getBookmarks } from "@/lib/api/social";

const SPONSORED_DISMISS_KEY = "comestag_feed_sponsored_dismissed";
const DISMISSED_PARTNERS_KEY = "comestag_dismissed_recommended_partners";
const showFeedSponsoredSlot =
  typeof process.env.NEXT_PUBLIC_FEED_SHOW_SPONSORED === "undefined" ||
  process.env.NEXT_PUBLIC_FEED_SHOW_SPONSORED === "true";
import Button from "@/components/atoms/button";
import OnboardingChecklist from "@/components/molecules/onboarding-checklist";
import DomainVerificationBanner from "@/components/molecules/domain-verification-banner";

export default function DashboardPage() {
  const { user } = useAuth(true);
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedSearch, setFeedSearch] = useState("");
  const [feedTab, setFeedTab] = useState<"all" | "latest" | "trending" | "following">("all");
  const [feedIndustry, setFeedIndustry] = useState("");
  const [followingOrgIds, setFollowingOrgIds] = useState<Set<string>>(new Set());
  const [showChecklist, setShowChecklist] = useState(true);
  const [recommendedPartners, setRecommendedPartners] = useState<
    { id: string; displayName: string; companyType?: string; industry?: string; matchScore: number; profileImageId?: string; verified?: boolean }[]
  >([]);
  const [sponsoredHidden, setSponsoredHidden] = useState(false);
  const [dismissedPartnerIds, setDismissedPartnerIds] = useState<Set<string>>(new Set());
  const [rfqUrgency, setRfqUrgency] = useState<"all" | "7d" | "3d" | "overdue">("all");
  const [feedRegion, setFeedRegion] = useState("");
  const [feedDrawerOpen, setFeedDrawerOpen] = useState(false);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      setSponsoredHidden(localStorage.getItem(SPONSORED_DISMISS_KEY) === "1");
      const raw = localStorage.getItem(DISMISSED_PARTNERS_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        if (Array.isArray(arr)) setDismissedPartnerIds(new Set(arr));
      }
    } catch { /* ignore */ }
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      const [profileRes, postsRes, rfqsRes] = await Promise.all([
        getProfile(),
        getPosts(),
        listRfqs({ filter: "available", page: 0, size: 10 }),
      ]);

      if (profileRes.success && profileRes.data && isOrganizationProfile(profileRes.data)) {
        setProfile(profileRes.data);
      }

      if (postsRes.success && postsRes.data && "items" in postsRes.data) {
        setPosts(postsRes.data.items || []);
      }

      if (rfqsRes.success && rfqsRes.data && "content" in rfqsRes.data) {
        setRfqs(rfqsRes.data.content || []);
      }

      try {
        const partnersRes = await authenticatedGet<{ id: string; displayName: string; companyType?: string; industry?: string; matchScore: number; profileImageId?: string; verified?: boolean }[]>(
          "/v1/partners/recommended?limit=5"
        );
        if (partnersRes.success && Array.isArray(partnersRes.data)) {
          setRecommendedPartners(partnersRes.data);
        }
      } catch { /* non-critical */ }

      try {
        const followingRes = await getFollowingIds();
        if (followingRes.success && followingRes.data?.ids?.length) {
          setFollowingOrgIds(new Set(followingRes.data.ids));
        } else {
          setFollowingOrgIds(new Set());
        }
      } catch {
        setFollowingOrgIds(new Set());
      }

      try {
        const bm = await getBookmarks("POST", 0, 200);
        const raw = bm.data as { content?: { targetId: string }[]; items?: { targetId: string }[] } | undefined;
        const list = raw?.content ?? raw?.items;
        if (bm.success && list?.length) {
          setBookmarkedPostIds(new Set(list.map((b) => b.targetId)));
        }
      } catch { /* optional */ }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // useAuth hook handles loading/redirect
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const dismissPartner = (id: string) => {
    setDismissedPartnerIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(DISMISSED_PARTNERS_KEY, JSON.stringify([...next]));
      } catch { /* ignore */ }
      return next;
    });
  };

  const rfqMatchesUrgency = (deadline: string | null | undefined) => {
    if (rfqUrgency === "all" || !deadline) return true;
    const days = getDaysUntilDeadline(deadline);
    if (rfqUrgency === "overdue") return days < 0;
    if (rfqUrgency === "3d") return days >= 0 && days <= 3;
    if (rfqUrgency === "7d") return days >= 0 && days <= 7;
    return true;
  };

  const visibleRfqs = rfqs.filter((r) => rfqMatchesUrgency(r.deadline));

  const profileIndustryName = profile?.industry?.name?.toLowerCase() ?? "";

  const feedRelevanceScore = (p: Post): number => {
    let s = 0;
    const body = (p.body || "").toLowerCase();
    const org = (p.organizationName || "").toLowerCase();
    if (profileIndustryName && (body.includes(profileIndustryName) || org.includes(profileIndustryName))) {
      s += 40;
    }
    s += Math.min(30, (p.reactionsCount ?? 0) * 3);
    if (bookmarkedPostIds.has(p.id)) s += 18;
    const ageHours = (Date.now() - new Date(p.createdAt).getTime()) / 36e5;
    s += Math.max(0, 30 - Math.min(30, ageHours / 24));
    return s;
  };

  const filteredPosts = posts
    .filter((p) => {
      if (feedTab === "following") {
        if (!followingOrgIds.has(p.organizationId)) return false;
      }
      if (feedIndustry) {
        const pAny = p as unknown as Record<string, unknown>;
        const industry = (pAny.industry as string | undefined)
          || (pAny.organizationIndustry as string | undefined)
          || "";
        if (!industry.toLowerCase().includes(feedIndustry.toLowerCase())) return false;
      }
      if (feedRegion.trim()) {
        const r = feedRegion.toLowerCase().trim();
        const hay = `${(p.body || "").toLowerCase()} ${(p.organizationName || "").toLowerCase()}`;
        if (!hay.includes(r)) return false;
      }
      if (!feedSearch.trim()) return true;
      const q = feedSearch.toLowerCase();
      return (
        p.body?.toLowerCase().includes(q) ||
        p.organizationName?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (feedTab === "trending") {
        return (b.reactionsCount ?? 0) - (a.reactionsCount ?? 0);
      }
      if (feedTab === "all") {
        return feedRelevanceScore(b) - feedRelevanceScore(a);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const feedWhyHint =
    feedTab === "following"
      ? "Posts from companies you follow."
      : feedTab === "trending"
        ? "Sorted by reactions in your network."
        : feedTab === "all"
          ? "Ranked by relevance to your industry, engagement, and recency — not chronological only."
          : "Newest posts first.";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[200px] md:h-[257px] flex flex-col items-center justify-center gap-4 md:gap-[27px] px-4 sm:px-8 md:px-20 lg:px-[303px] py-8 md:py-[47px]">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-white text-center">
          Welcome back, {user.name}!
        </h1>
        <p className="text-3xl sm:text-4xl md:text-[48px] text-white text-center font-['Hubballi']">
          Your Dashboard
        </p>
        {profile && !(profile.profileImageId || profile.profileImage) && (
          <Link
            href="/profile/edit"
            className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full text-sm text-white transition-colors"
          >
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            Complete your profile to get discovered
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[50px] py-6 md:py-[46px]">
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-6">
            <DomainVerificationBanner />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Company Profile Card */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
                {/* Cover / Banner */}
                <div className="h-20 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 relative">
                  {profile?.coverImage && (
                    <Image
                      src={profile.coverImage}
                      alt="Cover"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Profile Photo */}
                <div className="px-4 -mt-12 relative z-10">
                  {profile?.profileImage ? (
                    <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden">
                      <Image
                        src={profile.profileImage}
                        alt={profile.displayName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-primary flex items-center justify-center">
                      <span className="text-3xl text-white font-bold">
                        {profile?.displayName?.charAt(0)?.toUpperCase() || "C"}
                      </span>
                    </div>
                  )}
                </div>

                {profile && (
                  <div className="px-4 pt-3 pb-5">
                    {/* Name + Verified Badge */}
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight truncate">
                        {profile.displayName}
                      </h3>
                      {profile.verified && (
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-label="Verified company">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                    </div>

                    {/* Industry / Title */}
                    {(profile.industry || profile.whoWeAre) && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {profile.industry?.name}
                        {profile.industry && profile.whoWeAre && " · "}
                        {profile.whoWeAre}
                      </p>
                    )}

                    {/* Location */}
                    {(profile.city || profile.state || profile.country) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {[profile.city, profile.state, profile.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}

                    {/* Company badge */}
                    {profile.size && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-600 font-medium">
                          {profile.size} employees
                        </span>
                      </div>
                    )}

                    {/* Tech Stack Tags */}
                    {profile.techStack && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {profile.techStack.split(",").map((t: string) => t.trim()).filter(Boolean).slice(0, 5).map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full">
                            {tag}
                          </span>
                        ))}
                        {(profile.techStack.split(",").filter(Boolean).length > 5) && (
                          <span className="px-2 py-0.5 text-[10px] text-gray-400">
                            +{profile.techStack.split(",").filter(Boolean).length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-gray-100 mt-4 pt-4">
                      {/* Website */}
                      {profile.website && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Globe className="w-4 h-4 flex-shrink-0" />
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            {profile.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      )}
                      {profile.established && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>Est. {new Date(profile.established).getFullYear()}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="border-t border-gray-100 mt-4 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{posts.length}</div>
                          <div className="text-xs text-gray-500">Posts</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{rfqs.length}</div>
                          <div className="text-xs text-gray-500">Opportunities</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 space-y-2">
                      <Link
                        href="/profile"
                        className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                      >
                        View Profile
                      </Link>
                      <Link
                        href="/profile/edit"
                        className="block w-full text-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Edit Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {showChecklist && (
                <OnboardingChecklist
                  profile={profile}
                  postsCount={posts.length}
                  rfqCount={rfqs.length}
                  onDismiss={() => setShowChecklist(false)}
                />
              )}
            </div>

            {/* Center Column - Posts Feed */}
            <div className="lg:col-span-6 space-y-4">
              {/* Search + Filters */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={feedSearch}
                    onChange={(e) => setFeedSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg shadow-sm border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
                <select
                  value={feedIndustry}
                  onChange={(e) => setFeedIndustry(e.target.value)}
                  className="px-3 py-2.5 bg-white rounded-lg shadow-sm border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  aria-label="Filter posts by industry keyword"
                >
                  <option value="">All Industries</option>
                  <option value="technology">Technology</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="automotive">Automotive</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="fintech">Fintech</option>
                  <option value="energy">Energy</option>
                </select>
                <button
                  type="button"
                  onClick={() => setFeedDrawerOpen(true)}
                  className="px-3 py-2.5 bg-white rounded-lg shadow-sm border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1"
                  aria-expanded={feedDrawerOpen}
                  aria-controls="feed-filter-drawer"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 items-center text-xs text-gray-600 bg-white/80 rounded-lg px-3 py-2 border border-gray-100">
                <span className="font-semibold text-gray-500 uppercase tracking-wide">Discover</span>
                <Link href="/rfq" className="text-primary font-medium hover:underline">
                  RFQ marketplace
                </Link>
                <span className="text-gray-300" aria-hidden>
                  ·
                </span>
                <Link href="/opportunities" className="text-primary font-medium hover:underline">
                  Opportunities hub
                </Link>
                <span className="text-gray-300" aria-hidden>
                  ·
                </span>
                <Link href="/messages" className="text-primary font-medium hover:underline">
                  Messages
                </Link>
                <span className="text-gray-300" aria-hidden>
                  ·
                </span>
                <Link href="/analytics" className="text-primary font-medium hover:underline">
                  Analytics
                </Link>
              </div>

              {feedDrawerOpen && (
                <div
                  id="feed-filter-drawer"
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3"
                  role="region"
                  aria-label="Additional feed filters"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800">Region or keyword</span>
                    <button type="button" className="p-1 rounded hover:bg-gray-100" onClick={() => setFeedDrawerOpen(false)} aria-label="Close filters">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={feedRegion}
                    onChange={(e) => setFeedRegion(e.target.value)}
                    placeholder="Match in post text or company name (e.g. Germany, APAC)"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    RFQ deadline urgency appears in the Opportunities column. Multi-axis RFQ filters live on the RFQ page.
                  </p>
                  <button
                    type="button"
                    className="text-sm text-primary"
                    onClick={() => { setFeedRegion(""); setFeedIndustry(""); }}
                  >
                    Clear industry &amp; region
                  </button>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-wrap gap-1 bg-gray-100 rounded-lg p-0.5">
                    {(["all", "latest", "trending", "following"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setFeedTab(tab)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                          feedTab === tab
                            ? "bg-white text-primary shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab === "trending" ? (
                          <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{tab}</span>
                        ) : tab === "following" ? (
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />Following</span>
                        ) : (
                          tab
                        )}
                      </button>
                    ))}
                  </div>
                  <Link
                    href="/posts"
                    className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <p className="text-xs text-gray-500 mb-4" title="How this feed is ordered">
                  Why you&apos;re seeing this: {feedWhyHint}
                </p>

                {/* Sponsored content slot */}
                {showFeedSponsoredSlot && !sponsoredHidden && feedTab === "all" && filteredPosts.length > 0 && (
                  <div className="mb-4 p-4 rounded-lg border border-dashed border-amber-200 bg-amber-50/50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                        <Megaphone className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">Ad</span>
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">Sponsored placement</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-0.5">Boost your company&apos;s visibility</p>
                        <p className="text-xs text-gray-500">Promote your RFQs, opportunities, or company profile to reach more partners.</p>
                        <Link
                          href="/settings"
                          className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium mt-2 hover:underline"
                        >
                          Learn about promotions <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 text-xs flex-shrink-0"
                        onClick={() => {
                          try {
                            localStorage.setItem(SPONSORED_DISMISS_KEY, "1");
                          } catch { /* ignore */ }
                          setSponsoredHidden(true);
                        }}
                      >
                        Hide
                      </button>
                    </div>
                  </div>
                )}

                {filteredPosts.length > 0 ? (
                  <PostsFeed
                    posts={filteredPosts}
                    showFullContent={false}
                    bookmarkedPostIds={bookmarkedPostIds}
                    relevanceByPostId={
                      feedTab === "all"
                        ? Object.fromEntries(
                            filteredPosts.map((p) => [
                              p.id,
                              Math.round(Math.min(100, feedRelevanceScore(p))),
                            ])
                          )
                        : undefined
                    }
                  />
                ) : feedTab === "following" ? (
                  <div className="text-center py-12 px-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No posts from followed companies</h3>
                    <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
                      {followingOrgIds.size === 0
                        ? "Follow organizations from their profile to see their updates here."
                        : "No recent posts from companies you follow. Try All or Latest."}
                    </p>
                    <Link
                      href="/opportunities"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
                    >
                      Discover companies
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-12 px-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                      <FileText className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No posts yet</h3>
                    <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
                      Your feed will light up once companies in your network start sharing updates.
                    </p>
                    <Link
                      href="/rfq"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
                    >
                      Explore RFQs instead
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Opportunities */}
            <div className="lg:col-span-3 space-y-6">
              {/* Role-aware CTA */}
              {profile?.companyType && (
                <div className={`rounded-lg p-4 border ${
                  profile.companyType === "ENTERPRISE" ? "bg-gradient-to-br from-slate-50 to-blue-50 border-blue-100" :
                  profile.companyType === "VENDOR" ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100" :
                  profile.companyType === "STARTUP" ? "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100" :
                  profile.companyType === "INVESTOR" ? "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100" :
                  "bg-gradient-to-br from-cyan-50 to-sky-50 border-cyan-100"
                }`}>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${
                    profile.companyType === "ENTERPRISE" ? "bg-blue-100 text-blue-700" :
                    profile.companyType === "VENDOR" ? "bg-emerald-100 text-emerald-700" :
                    profile.companyType === "STARTUP" ? "bg-orange-100 text-orange-700" :
                    profile.companyType === "INVESTOR" ? "bg-purple-100 text-purple-700" :
                    "bg-cyan-100 text-cyan-700"
                  }`}>
                    {profile.companyType.replace("_", " ")}
                  </span>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {profile.companyType === "ENTERPRISE" && "Find suppliers & technology partners"}
                    {profile.companyType === "VENDOR" && "Discover new enterprise clients"}
                    {profile.companyType === "STARTUP" && "Connect with investors & incubators"}
                    {profile.companyType === "INVESTOR" && "Browse startups seeking funding"}
                    {profile.companyType === "SERVICE_PROVIDER" && "Find project opportunities"}
                  </p>
                  <Link
                    href={profile.companyType === "INVESTOR" ? "/opportunities" : "/rfq"}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    {profile.companyType === "ENTERPRISE" && "Browse RFQ marketplace"}
                    {profile.companyType === "VENDOR" && "Browse open RFQs"}
                    {profile.companyType === "STARTUP" && "View opportunities"}
                    {profile.companyType === "INVESTOR" && "Explore deal flow"}
                    {profile.companyType === "SERVICE_PROVIDER" && "Find projects"}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-primary-dark flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Opportunities
                  </h2>
                  <Link
                    href="/rfq"
                    className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="mb-4">
                  <label htmlFor="rfq-urgency-filter" className="sr-only">
                    Filter RFQs by deadline urgency
                  </label>
                  <select
                    id="rfq-urgency-filter"
                    value={rfqUrgency}
                    onChange={(e) => setRfqUrgency(e.target.value as typeof rfqUrgency)}
                    className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 text-gray-700"
                  >
                    <option value="all">All deadlines</option>
                    <option value="7d">Due within 7 days</option>
                    <option value="3d">Due within 3 days</option>
                    <option value="overdue">Past deadline</option>
                  </select>
                </div>

                {visibleRfqs.length > 0 ? (
                  <div className="space-y-4">
                    {visibleRfqs.map((rfq) => {
                      const daysLeft = getDaysUntilDeadline(rfq.deadline || "");
                      return (
                        <Link
                          key={rfq.id}
                          href={`/rfq/${rfq.id}`}
                          className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                              {rfq.title}
                            </h3>
                            <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                              {rfq.status}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {rfq.description}
                          </p>

                          <div className="space-y-2">
                            {rfq.budget && (
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <DollarSign className="w-3 h-3" />
                                <span>{formatCurrency(rfq.budget, rfq.budgetCurrency)}</span>
                              </div>
                            )}
                            {rfq.deadline && (
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {daysLeft > 0
                                    ? `${daysLeft} days left`
                                    : daysLeft === 0
                                    ? "Due today"
                                    : "Expired"}
                                </span>
                              </div>
                            )}
                            {rfq.proposalCount > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Users className="w-3 h-3" />
                                <span>{rfq.proposalCount} proposals</span>
                              </div>
                            )}
                          </div>

                          {rfq.category && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-light text-primary rounded">
                                {rfq.category}
                              </span>
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ) : rfqs.length > 0 ? (
                  <div className="text-center py-6 px-3">
                    <p className="text-sm text-gray-600 mb-1">No RFQs match this urgency filter.</p>
                    <button
                      type="button"
                      className="text-xs text-primary font-medium hover:underline"
                      onClick={() => setRfqUrgency("all")}
                    >
                      Show all deadlines
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8 px-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 mb-3">
                      <Briefcase className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">No open opportunities</p>
                    <p className="text-xs text-gray-500 mb-4">Post an RFQ to get proposals from the community.</p>
                    <Link
                      href="/rfq"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Browse RFQs
                    </Link>
                  </div>
                )}
              </div>

              {/* Trending in Your Network */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-semibold text-primary-dark flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Trending in your industry
                </h2>
                <p className="text-[11px] text-gray-400 mb-4 leading-snug">
                  Method: posts with most reactions in your feed; when your profile lists an industry, matches are highlighted first in the list below.
                </p>
                {posts.length > 0 ? (
                  <div className="space-y-3">
                    {posts
                      .slice()
                      .sort((a, b) => {
                        const score = (p: Post) => {
                          let s = (p.reactionsCount || 0) * 10;
                          if (profileIndustryName) {
                            const t = `${(p.body || "").toLowerCase()} ${(p.organizationName || "").toLowerCase()}`;
                            if (t.includes(profileIndustryName)) s += 50;
                          }
                          return s;
                        };
                        return score(b) - score(a);
                      })
                      .slice(0, 3)
                      .map((post, idx) => (
                        <div
                          key={post.id}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-lg font-bold text-gray-300 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 line-clamp-2">
                              {post.body?.slice(0, 80)}
                              {(post.body?.length || 0) > 80 ? "..." : ""}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              {post.organizationName && (
                                <span>{post.organizationName}</span>
                              )}
                              {(post.reactionsCount || 0) > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <span className="text-red-400">&#x2764;</span>
                                  {post.reactionsCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">
                    Nothing trending yet. Activity will appear as the network grows.
                  </p>
                )}
              </div>

              {/* Recommended Partners */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-semibold text-primary-dark flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-primary" />
                  Recommended partners
                </h2>
                <p className="text-[11px] text-gray-400 mb-4 leading-snug">
                  Fit score (heuristic): industry overlap and activity — not semantic AI or embeddings.
                </p>
                {recommendedPartners.filter((p) => !dismissedPartnerIds.has(p.id)).length > 0 ? (
                  <div className="space-y-3">
                    {recommendedPartners
                      .filter((p) => !dismissedPartnerIds.has(p.id))
                      .map((partner) => (
                      <div key={partner.id} className="flex items-center gap-2">
                        <Link
                          href={`/organization/${partner.id}`}
                          className="flex flex-1 items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-blue-50/30 transition-colors min-w-0"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{partner.displayName}</div>
                            <div className="text-xs text-gray-500">
                              {partner.industry || "Technology"} &middot; {(partner.companyType || "").replace("_", " ") || "Company"}
                            </div>
                          </div>
                          <span
                            className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0"
                          title="Fit score (heuristic) from industry overlap and activity — not semantic AI or embeddings."
                        >
                          Fit score (heuristic) {partner.matchScore}%
                        </span>
                        </Link>
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 flex-shrink-0"
                          title="Not relevant — hide this suggestion"
                          aria-label={`Dismiss ${partner.displayName} from recommendations`}
                          onClick={() => dismissPartner(partner.id)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">
                    Partner recommendations will appear as more companies join.
                  </p>
                )}
                <Link href="/opportunities" className="flex items-center justify-center gap-1 text-xs text-primary font-medium mt-3 hover:underline">
                  Discover more partners <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Roadmap: semantic v2 + unified filters (feed + opportunities) */}
              <div className="bg-gradient-to-br from-violet-50 to-white rounded-lg border border-violet-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-violet-100 text-violet-700">
                    <Sparkles className="w-5 h-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">Semantic matching v2 (roadmap)</h3>
                    <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                      Planned: embedding-based relevance, shared filter chips, and saved views that stay in sync between the feed and opportunities.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-violet-200 text-violet-800 hover:bg-violet-50"
                      >
                        Feed <ArrowRight className="w-3 h-3" />
                      </Link>
                      <Link
                        href="/opportunities"
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-violet-200 text-violet-800 hover:bg-violet-50"
                      >
                        Opportunities <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Quick Link */}
              <Link
                href="/analytics"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 hover:border-indigo-200 transition-colors group"
              >
                <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">View Analytics</div>
                  <div className="text-xs text-gray-500">Track your performance</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
