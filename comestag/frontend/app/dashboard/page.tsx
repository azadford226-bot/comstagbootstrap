"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import Image from "next/image";
import { Building2, MapPin, Globe, Calendar, Briefcase, TrendingUp, Users, FileText, ArrowRight, Clock, DollarSign, Search } from "lucide-react";
import { getProfile, OrganizationProfile, isOrganizationProfile } from "@/lib/api/profile";
import { getPosts, Post } from "@/lib/api/posts";
import { listRfqs, Rfq } from "@/lib/api/rfq";
import { PostsFeed } from "@/components/ui/posts-feed";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { getMediaUrl } from "@/lib/api/media";
import Button from "@/components/atoms/button";
import OnboardingChecklist from "@/components/molecules/onboarding-checklist";

export default function DashboardPage() {
  const { user } = useAuth(true);
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedSearch, setFeedSearch] = useState("");
  const [feedTab, setFeedTab] = useState<"all" | "latest" | "trending">("all");
  const [showChecklist, setShowChecklist] = useState(true);

  useEffect(() => {
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

  const filteredPosts = posts
    .filter((p) => {
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
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

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
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={feedSearch}
                  onChange={(e) => setFeedSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg shadow-sm border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                    {(["all", "latest", "trending"] as const).map((tab) => (
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
                        ) : tab}
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

                {filteredPosts.length > 0 ? (
                  <PostsFeed posts={filteredPosts} showFullContent={false} />
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
                <div className="flex items-center justify-between mb-6">
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

                {rfqs.length > 0 ? (
                  <div className="space-y-4">
                    {rfqs.map((rfq) => {
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
                <h2 className="text-sm font-semibold text-primary-dark flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Trending in Your Network
                </h2>
                {posts.length > 0 ? (
                  <div className="space-y-3">
                    {posts
                      .slice()
                      .sort((a, b) => (b.reactionsCount || 0) - (a.reactionsCount || 0))
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
                <h2 className="text-sm font-semibold text-primary-dark flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-primary" />
                  Recommended Partners
                </h2>
                <div className="space-y-3">
                  {[
                    { name: "TechVentures Inc.", type: "Enterprise", match: 92, industry: "Cloud Services" },
                    { name: "DataFlow Systems", type: "Vendor", match: 87, industry: "Data Analytics" },
                    { name: "InnovateLab", type: "Startup", match: 81, industry: "AI/ML" },
                  ].map((partner) => (
                    <div
                      key={partner.name}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-blue-50/30 transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{partner.name}</div>
                        <div className="text-xs text-gray-500">{partner.industry} &middot; {partner.type}</div>
                      </div>
                      <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">
                        {partner.match}%
                      </span>
                    </div>
                  ))}
                </div>
                <Link href="/rfq" className="flex items-center justify-center gap-1 text-xs text-primary font-medium mt-3 hover:underline">
                  Discover more partners <ArrowRight className="w-3 h-3" />
                </Link>
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
        )}
      </div>
    </div>
  );
}
