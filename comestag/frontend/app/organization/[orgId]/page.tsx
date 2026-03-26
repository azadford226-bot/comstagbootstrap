"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Star, MapPin, Globe, Calendar, UserPlus, UserCheck, Building2, FileText, Briefcase, MessageCircle, Activity, BadgeCheck } from "lucide-react";
import Image from "next/image";
import { getPublicProfile, getProfile, OrganizationProfile, isOrganizationProfile } from "@/lib/api/profile";
import { getCapabilities, Capability } from "@/lib/api/capabilities";
import {
  getCertificates,
  getSuccessStories,
  getTestimonials,
  createTestimonial,
  Certificate,
  SuccessStory,
  Testimonial,
} from "@/lib/api/content";
import { getMediaUrl } from "@/lib/api/media";
import { getPosts, Post } from "@/lib/api/posts";
import { getLatestPosts } from "@/lib/utils/posts";
import { PostsFeed } from "@/components/ui/posts-feed";
import { logger } from "@/lib/logger";
import Button from "@/components/atoms/button";
import { AuthenticatedImage } from "@/components/atoms/authenticated-image";
import { Skeleton } from "@/components/ui/skeleton";
import { followUser, unfollowUser, getFollowStatus, getFollowCounts, getOrgReviews, createReview, type Review, type ReviewsData } from "@/lib/api/social";
import { authenticatedGet, authenticatedPost } from "@/lib/api/api-client";
import Link from "next/link";

export default function PublicOrganizationProfile() {
  const params = useParams();
  const _orgId = params.orgId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", body: "", engagementType: "RFQ" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoveredCert, setHoveredCert] = useState<Certificate | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [similarCompanies, setSimilarCompanies] = useState<Array<{ id: string; displayName: string; industry?: string; matchScore?: number }>>([]);

  useEffect(() => {
    if (_orgId) {
      loadPublicProfile();
    }
  }, [_orgId]);

  const loadPublicProfile = async () => {
    try {
      setIsLoading(true);

      const [
        profileRes,
        capabilitiesRes,
        certificatesRes,
        storiesRes,
        postsRes,
        testimonialsRes,
      ] = await Promise.all([
        getPublicProfile(_orgId),
        getCapabilities(_orgId),
        getCertificates(_orgId),
        getSuccessStories(_orgId),
        getPosts(_orgId),
        getTestimonials(_orgId),
      ]);

      if (profileRes.success && profileRes.data && isOrganizationProfile(profileRes.data)) {
        setProfile(profileRes.data);
      } else if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data as OrganizationProfile);
      }

      if (profileRes.success && profileRes.data?.id) {
        const viewedId = profileRes.data.id;
        try {
          const me = await getProfile();
          if (me.success && me.data?.id && me.data.id !== viewedId) {
            await authenticatedPost("/v1/analytics/track", {
              eventType: "profile_view",
              targetAccountId: viewedId,
              data: JSON.stringify({ surface: "organization_profile" }),
            });
          }
        } catch {
          /* not signed in or tracking optional */
        }
      }

      if (capabilitiesRes.success && capabilitiesRes.data) {
        setCapabilities(capabilitiesRes.data.items || []);
      }

      if (certificatesRes.success && certificatesRes.data) {
        setCertificates(certificatesRes.data.items || []);
      }

      if (storiesRes.success && storiesRes.data) {
        setSuccessStories(storiesRes.data.items || []);
      }

      if (postsRes.success && postsRes.data) {
        setPosts(postsRes.data.items || []);
      }

      if (testimonialsRes.success && testimonialsRes.data) {
        setTestimonials(testimonialsRes.data.items || []);
      }

      try {
        const [followStatus, followCounts] = await Promise.all([
          getFollowStatus(_orgId),
          getFollowCounts(_orgId),
        ]);
        if (followStatus.success && followStatus.data) {
          setFollowing(followStatus.data.following);
        }
        if (followCounts.success && followCounts.data) {
          setFollowersCount(followCounts.data.followers);
          setFollowingCount(followCounts.data.following);
        }
      } catch {
        // Follow status is non-critical
      }

      try {
        const reviewsRes = await getOrgReviews(_orgId);
        if (reviewsRes.success && reviewsRes.data) {
          setReviews(reviewsRes.data.reviews || []);
          setAvgRating(reviewsRes.data.averageRating || 0);
          setReviewCount(reviewsRes.data.totalReviews || 0);
        }
      } catch {
        // Reviews are non-critical
      }

      try {
        const partnersRes = await authenticatedGet<Array<{ id: string; displayName: string; industry?: string; matchScore?: number }>>(`/v1/partners/recommended?limit=5`);
        if (partnersRes.success && partnersRes.data) {
          const filtered = (partnersRes.data as Array<{ id: string; displayName: string; industry?: string; matchScore?: number }>).filter((p) => p.id !== _orgId);
          setSimilarCompanies(filtered.slice(0, 4));
        }
      } catch {
        // Similar companies are non-critical
      }
    } catch (error) {
      logger.error("Failed to load public profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAverageRating = (): string => {
    if (testimonials.length === 0) return "0";
    const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
    return (sum / testimonials.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Skeleton className="h-64 w-full rounded-none" />
        <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Skeleton className="w-32 h-32 rounded-full shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6 space-y-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6 space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Organization Not Found
          </h2>
          <p className="text-gray-600">
            The organization you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 bg-linear-to-r from-primary to-primary-dark">
        {(profile.profileCoverId || profile.coverImage) && (
          <Image
            src={getMediaUrl((profile.profileCoverId || profile.coverImage)!)}
            alt="Cover"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Header with Profile Image and Basic Info */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 shrink-0">
              {profile.profileImageId || profile.profileImage ? (
                <Image
                  src={getMediaUrl(
                    (profile.profileImageId || profile.profileImage)!
                  )}
                  alt={profile.displayName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary">
                  {profile.displayName?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Organization Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                {profile.displayName}
                {profile.verified && (
                  <span title="Admin-verified organization — identity reviewed by platform operators." className="text-blue-500">
                    <BadgeCheck className="w-6 h-6" aria-label="Admin verified" />
                  </span>
                )}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Trust signals">
                <span
                  className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700"
                  title="Business email and signup checks completed."
                  role="listitem"
                >
                  Account verified
                </span>
                {profile.verified && (
                  <span
                    className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-800"
                    title="Platform staff confirmed this organization."
                    role="listitem"
                  >
                    Admin verified
                  </span>
                )}
                <span
                  className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-800"
                  title="Upload certificates in your profile; domain DNS verification is in Settings."
                  role="listitem"
                >
                  Domain &amp; certs — self-serve
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                {profile.city && profile.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {profile.city}, {profile.country}
                    </span>
                  </div>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                )}
                {profile.established && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Est. {new Date(profile.established).getFullYear()}
                    </span>
                  </div>
                )}
              </div>

              {/* Rating */}
              {testimonials.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(parseFloat(calculateAverageRating()))
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {calculateAverageRating()} ({testimonials.length} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={async () => {
                  if (followLoading) return;
                  setFollowLoading(true);
                  try {
                    if (following) {
                      await unfollowUser(_orgId);
                      setFollowing(false);
                      setFollowersCount((c) => Math.max(0, c - 1));
                    } else {
                      await followUser(_orgId);
                      setFollowing(true);
                      setFollowersCount((c) => c + 1);
                    }
                  } catch { /* ignore */ }
                  setFollowLoading(false);
                }}
                disabled={followLoading}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-60 ${
                  following
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                {following ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Follow
                  </>
                )}
              </button>
              <Button
                onClick={() => setShowTestimonialForm(true)}
                type="primary"
                size="small"
              >
                Write a Review
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {(profile.whoWeAre || profile.whatWeDo) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
                {profile.whoWeAre && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Who We Are
                    </h3>
                    <p className="text-gray-600">{profile.whoWeAre}</p>
                  </div>
                )}
                {profile.whatWeDo && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      What We Do
                    </h3>
                    <p className="text-gray-600">{profile.whatWeDo}</p>
                  </div>
                )}
              </div>
            )}

            {/* Latest Posts */}
            {posts.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Latest Posts
                </h2>
                <PostsFeed posts={getLatestPosts(posts, 3)} maxPosts={3} />
              </div>
            )}

            {/* Partner Reviews */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Partner Reviews
                </h2>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  {showReviewForm ? "Cancel" : "Write a Review"}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Reviews are for partners who have engaged with this organization on the platform (for example through an RFQ, opportunity, or project). This keeps feedback tied to real collaboration, not drive-by ratings.
              </p>

              {/* Rating Summary */}
              <div className="flex items-center gap-4 mb-4 p-4 bg-amber-50 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-700">{avgRating.toFixed(1)}</div>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= Math.round(avgRating) ? "text-amber-500 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-amber-600 mt-1">{reviewCount} review{reviewCount !== 1 ? "s" : ""}</div>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter((r) => r.rating === star).length;
                    const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-right text-gray-500">{star}</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-6 text-right text-gray-400">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Rating:</span>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                      >
                        <Star
                          className={`w-6 h-6 cursor-pointer transition-colors ${
                            s <= reviewForm.rating ? "text-amber-500 fill-current" : "text-gray-300 hover:text-amber-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <select
                    value={reviewForm.engagementType}
                    onChange={(e) => setReviewForm({ ...reviewForm, engagementType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="RFQ">RFQ Engagement</option>
                    <option value="JV">Joint Venture</option>
                    <option value="PROJECT">Project Collaboration</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Review title"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                  <textarea
                    placeholder="Share your experience working with this company..."
                    value={reviewForm.body}
                    onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                  />
                  <button
                    onClick={async () => {
                      if (!reviewForm.body.trim()) return;
                      setSubmittingReview(true);
                      try {
                        await createReview({
                          reviewedOrgId: _orgId,
                          rating: reviewForm.rating,
                          title: reviewForm.title,
                          body: reviewForm.body,
                          engagementType: reviewForm.engagementType,
                        });
                        const res = await getOrgReviews(_orgId);
                        if (res.success && res.data) {
                          setReviews(res.data.reviews || []);
                          setAvgRating(res.data.averageRating || 0);
                          setReviewCount(res.data.totalReviews || 0);
                        }
                        setShowReviewForm(false);
                        setReviewForm({ rating: 5, title: "", body: "", engagementType: "RFQ" });
                      } catch { /* ignore */ }
                      setSubmittingReview(false);
                    }}
                    disabled={submittingReview || !reviewForm.body.trim()}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              )}

              {/* Review List */}
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No reviews yet. Be the first to share your experience!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= review.rating ? "text-amber-500 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        {review.engagementType && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {review.engagementType}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.title && (
                        <h4 className="text-sm font-medium text-gray-900">{review.title}</h4>
                      )}
                      <p className="text-sm text-gray-600 mt-1">{review.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </h2>
              {posts.length === 0 && successStories.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No recent activity to display.</p>
              ) : (
                <div className="relative pl-6 space-y-0">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />
                  {[
                    ...posts.map((p) => ({
                      type: "post" as const,
                      id: p.id,
                      title: p.body?.slice(0, 100) || "Published a post",
                      date: p.createdAt,
                      reactions: p.reactionsCount || 0,
                      comments: p.commentsCount || 0,
                    })),
                    ...successStories.map((s) => ({
                      type: "story" as const,
                      id: s.id,
                      title: s.title || "Shared a success story",
                      date: s.createdAt,
                      reactions: 0,
                      comments: 0,
                    })),
                  ]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 8)
                    .map((item) => (
                      <div key={item.id} className="relative pb-5 last:pb-0">
                        <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm bg-primary" />
                        <div className="pl-3">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            {item.type === "post" ? (
                              <FileText className="w-3 h-3" />
                            ) : (
                              <Briefcase className="w-3 h-3" />
                            )}
                            <span className="capitalize">{item.type === "story" ? "Success Story" : "Post"}</span>
                            <span>&middot;</span>
                            <span>
                              {new Date(item.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 line-clamp-2">
                            {item.title}
                          </p>
                          {(item.reactions > 0 || item.comments > 0) && (
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                              {item.reactions > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <span className="text-red-400">&#x2764;</span>
                                  {item.reactions}
                                </span>
                              )}
                              {item.comments > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <MessageCircle className="w-3 h-3" />
                                  {item.comments}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Success Stories */}
            {successStories.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Success Stories
                </h2>
                <div className="space-y-4">
                  {successStories.map((story) => (
                    <div
                      key={story.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {story.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{story.body}</p>
                      {story.mediaIds && story.mediaIds.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {story.mediaIds.slice(0, 6).map((mediaId: string) => (
                            <div
                              key={mediaId}
                              className="relative w-24 h-24 rounded overflow-hidden"
                            >
                              <Image
                                src={getMediaUrl(mediaId)}
                                alt="Story media"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonials */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Reviews ({testimonials.length})
              </h2>
              {testimonials.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No reviews yet. Be the first to review this organization!
                </p>
              ) : (
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">
                          {testimonial.consumerName}
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {testimonial.comment}
                      </p>
                      <span className="text-sm text-gray-400">
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack Tags */}
            {profile.techStack && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.techStack.split(",").map((tag: string) => tag.trim()).filter(Boolean).map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Capabilities */}
            {capabilities.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Capabilities
                </h2>
                <div className="space-y-3">
                  {capabilities.map((capability) => (
                    <div
                      key={capability.id}
                      className="border-l-4 border-primary pl-3"
                    >
                      <h3 className="font-semibold text-gray-800">
                        {capability.title}
                      </h3>
                      <p className="text-sm text-gray-600">{capability.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates */}
            {certificates.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Certificates
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {certificates.map((cert) => {
                    const cardContent = (
                      <>
                        {(cert.image?.id || cert.imageId) && (
                          <div className="relative h-24 mb-2 rounded overflow-hidden bg-gray-100">
                            <AuthenticatedImage
                              src={getMediaUrl(
                                cert.image?.id || cert.imageId || ""
                              )}
                              alt={cert.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 min-h-8">
                          {cert.title}
                        </h4>
                      </>
                    );

                    const commonProps = {
                      onMouseEnter: (e: React.MouseEvent) => {
                        setHoveredCert(cert);
                        setMousePosition({ x: e.clientX, y: e.clientY });
                      },
                      onMouseMove: (e: React.MouseEvent) => {
                        setMousePosition({ x: e.clientX, y: e.clientY });
                      },
                      onMouseLeave: () => {
                        setHoveredCert(null);
                      },
                    };

                    if (cert.link) {
                      return (
                        <a
                          key={cert.id}
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border rounded-lg p-2 cursor-pointer hover:border-primary hover:shadow-md transition-all block"
                          {...commonProps}
                        >
                          {cardContent}
                        </a>
                      );
                    }

                    return (
                      <div
                        key={cert.id}
                        className="border rounded-lg p-2 hover:border-primary hover:shadow-md transition-all"
                        {...commonProps}
                      >
                        {cardContent}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Similar Companies */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Similar Companies</h2>
              {similarCompanies.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No recommendations available yet.</p>
              ) : (
                <div className="space-y-3">
                  {similarCompanies.map((company) => (
                    <Link
                      key={company.id}
                      href={`/organization/${company.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold text-sm">
                          {company.displayName?.[0]?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{company.displayName}</p>
                        {company.industry && (
                          <p className="text-xs text-gray-500 truncate">{company.industry}</p>
                        )}
                      </div>
                      {company.matchScore != null && (
                        <span
                          className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full"
                          title="Fit score (heuristic) — not semantic AI."
                        >
                          Fit score (heuristic) {company.matchScore}%
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Floating Certificate Detail Card */}
            {hoveredCert &&
              (() => {
                // Calculate tooltip dimensions (approximate)
                const tooltipWidth = 256; // w-64 = 16rem = 256px
                const tooltipHeight = 280; // approximate height
                const offset = 20;

                // Get viewport dimensions
                const viewportWidth =
                  typeof window !== "undefined" ? window.innerWidth : 1200;
                const viewportHeight =
                  typeof window !== "undefined" ? window.innerHeight : 800;

                // Calculate position with smart anchoring
                let left = mousePosition.x + offset;
                let top = mousePosition.y + offset;
                let transformX = "0";
                let transformY = "-50%";

                // Check right boundary
                if (left + tooltipWidth > viewportWidth) {
                  left = mousePosition.x - offset;
                  transformX = "-100%";
                }

                // Check bottom boundary
                if (top + tooltipHeight / 2 > viewportHeight) {
                  top = mousePosition.y - offset;
                  transformY = "-100%";
                }

                // Check top boundary
                if (top - tooltipHeight / 2 < 0) {
                  top = mousePosition.y + offset;
                  transformY = "0";
                }

                return (
                  <div
                    className="fixed z-50 pointer-events-none"
                    style={{
                      left: `${left}px`,
                      top: `${top}px`,
                      transform: `translate(${transformX}, ${transformY})`,
                    }}
                  >
                    <div className="bg-white rounded-lg shadow-2xl border-2 border-primary p-3 w-64">
                      {hoveredCert.imageId && (
                        <div className="relative h-32 mb-2 rounded overflow-hidden bg-gray-100">
                          <Image
                            src={getMediaUrl(hoveredCert.imageId)}
                            alt={hoveredCert.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-sm text-gray-800 mb-1.5">
                        {hoveredCert.title}
                      </h3>
                      {hoveredCert.body && (
                        <p className="text-xs text-gray-600 mb-1.5 line-clamp-3">
                          {hoveredCert.body}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(
                          hoveredCert.certificateDate
                        ).toLocaleDateString()}
                      </p>
                      {hoveredCert.link && (
                        <p className="text-xs text-primary mt-2 font-medium">
                          Click to view certificate
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>
      </div>

      {/* Testimonial Form Modal */}
      {showTestimonialForm && (
        <TestimonialFormModal
          _orgId={_orgId}
          onClose={() => setShowTestimonialForm(false)}
          onSuccess={() => {
            setShowTestimonialForm(false);
            loadPublicProfile();
          }}
        />
      )}
    </div>
  );
}

function TestimonialFormModal({
  _orgId,
  onClose,
  onSuccess,
}: {
  _orgId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await createTestimonial({
        orgId: _orgId,
        rating,
        comment,
        verificationCode,
      });

      if (result.success) {
        onSuccess();
      } else {
        setError(result.message || "Failed to submit review");
      }
    } catch {
      setError("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Write a Review
        </h2>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Share your experience with this organization..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter verification code from email"
            />
            <p className="text-xs text-gray-500 mt-1">
              A verification code has been sent to your email
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !comment || !verificationCode}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
