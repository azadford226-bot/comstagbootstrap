"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import Image from "next/image";
import { Building2, MapPin, Globe, Calendar, Briefcase, TrendingUp, Users, FileText, ArrowRight, Clock, DollarSign } from "lucide-react";
import { getProfile, OrganizationProfile, isOrganizationProfile } from "@/lib/api/profile";
import { getPosts, Post } from "@/lib/api/posts";
import { listRfqs, Rfq } from "@/lib/api/rfq";
import { PostsFeed } from "@/components/ui/posts-feed";
import { mockApiResponse, mockApiListResponse, mockProfile, mockPosts } from "@/lib/dev-mock-api";
import { getMediaUrl } from "@/lib/api/media";
import Button from "@/components/atoms/button";

// Mock RFQs for dev mode
const mockRfqs: Rfq[] = [
  {
    id: "rfq-1",
    organizationId: "org-other-1",
    title: "E-commerce Platform Development",
    description: "Looking for an experienced team to develop a modern e-commerce platform with payment integration and inventory management.",
    category: "Software Development",
    industryId: 1,
    budget: 50000,
    budgetCurrency: "USD",
    deadline: "2025-02-15T00:00:00Z",
    requirements: "5+ years experience, React/Node.js stack, payment gateway integration",
    status: "OPEN",
    visibility: "PUBLIC",
    awardedToId: null,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
    proposalCount: 3,
    hasSubmitted: false,
    isOwner: false,
  },
  {
    id: "rfq-2",
    organizationId: "org-other-2",
    title: "Cloud Migration Services",
    description: "Need assistance migrating our infrastructure to AWS. Looking for certified cloud architects.",
    category: "Cloud Services",
    industryId: 1,
    budget: 75000,
    budgetCurrency: "USD",
    deadline: "2025-03-01T00:00:00Z",
    requirements: "AWS certification required, experience with large-scale migrations",
    status: "OPEN",
    visibility: "PUBLIC",
    awardedToId: null,
    createdAt: "2025-01-10T14:30:00Z",
    updatedAt: "2025-01-10T14:30:00Z",
    proposalCount: 5,
    hasSubmitted: false,
    isOwner: false,
  },
  {
    id: "rfq-3",
    organizationId: "org-other-3",
    title: "Mobile App Development",
    description: "Seeking a team to build a cross-platform mobile application for iOS and Android.",
    category: "Software Development",
    industryId: 1,
    budget: 40000,
    budgetCurrency: "USD",
    deadline: "2025-02-28T00:00:00Z",
    requirements: "React Native or Flutter experience, published apps in portfolio",
    status: "OPEN",
    visibility: "PUBLIC",
    awardedToId: null,
    createdAt: "2025-01-12T09:00:00Z",
    updatedAt: "2025-01-12T09:00:00Z",
    proposalCount: 2,
    hasSubmitted: false,
    isOwner: false,
  },
];

export default function DashboardPage() {
  const { user } = useAuth(true);
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load profile
      const profileRes = await mockApiResponse(() => getProfile(), mockProfile);
      if (profileRes.success && profileRes.data && isOrganizationProfile(profileRes.data)) {
        setProfile(profileRes.data);
      }

      // Load posts (all posts, not just mine)
      const postsRes = await mockApiResponse(
        () => getPosts(),
        {
          items: mockPosts,
          totalItems: mockPosts.length,
          totalPages: 1,
          page: 1,
          size: mockPosts.length,
        } as { items: Post[]; totalItems: number; totalPages: number; page: number; size: number }
      );
      if (postsRes.success && postsRes.data && "items" in postsRes.data) {
        setPosts(postsRes.data.items || []);
      }

      // Load RFQs (available opportunities)
      const rfqsRes = await mockApiResponse(
        () => listRfqs({ filter: "available", page: 0, size: 10 }),
        {
          content: mockRfqs,
          totalElements: mockRfqs.length,
          totalPages: 1,
          size: 10,
          number: 0,
        } as { content: Rfq[]; totalElements: number; totalPages: number; size: number; number: number }
      );
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
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[50px] py-6 md:py-[46px]">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Company Information */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-primary-dark mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Company Info
                </h2>

                {profile && (
                  <div className="space-y-4">
                    {/* Company Logo/Image */}
                    {profile.profileImage && (
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                        <Image
                          src={profile.profileImage}
                          alt={profile.displayName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Company Name */}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{profile.displayName}</h3>
                      {profile.industry && (
                        <p className="text-sm text-gray-600 mt-1">{profile.industry.name}</p>
                      )}
                    </div>

                    {/* Company Details */}
                    <div className="space-y-2 text-sm">
                      {(profile.city || profile.state || profile.country) && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {[profile.city, profile.state, profile.country]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Globe className="w-4 h-4" />
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
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Est. {new Date(profile.established).getFullYear()}</span>
                        </div>
                      )}
                      {profile.size && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{profile.size} employees</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{posts.length}</div>
                          <div className="text-xs text-gray-600">Posts</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{rfqs.length}</div>
                          <div className="text-xs text-gray-600">Opportunities</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <Link
                        href="/profile"
                        className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                      >
                        View Profile
                      </Link>
                      <Link
                        href="/profile/edit"
                        className="block w-full text-center px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary-light transition-colors text-sm font-medium"
                      >
                        Edit Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center Column - Posts Feed */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-primary-dark flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Recent Posts
                  </h2>
                  <Link
                    href="/posts"
                    className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {posts.length > 0 ? (
                  <PostsFeed posts={posts} showFullContent={false} />
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No posts available yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Opportunities */}
            <div className="lg:col-span-3 space-y-6">
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
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-4">No opportunities available</p>
                    <Link
                      href="/rfq"
                      className="inline-block text-sm text-primary hover:text-primary-dark font-medium"
                    >
                      Browse All RFQs
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
