"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, Globe, Calendar } from "lucide-react";
import Image from "next/image";
import {
  getPublicProfile,
  ConsumerProfile,
  OrganizationProfile,
  isOrganizationProfile,
  isConsumerProfile,
} from "@/lib/api/profile";
import { getCapabilities, Capability } from "@/lib/api/capabilities";
import {
  getCertificates,
  getSuccessStories,
  getTestimonials,
  Certificate,
  SuccessStory,
  Testimonial,
} from "@/lib/api/content";
import { getPosts, Post } from "@/lib/api/posts";
import { getMediaUrl } from "@/lib/api/media";
import { PostsFeed } from "@/components/ui/posts-feed";
import { logger } from "@/lib/logger";
import { ProfileImage } from "@/components/molecules/profile-card";
import { AuthenticatedImage } from "@/components/atoms/authenticated-image";
import {
  mockApiResponse,
  mockProfile,
  mockConsumerProfile,
  mockCapabilities,
  mockCertificates,
  mockSuccessStories,
  mockPosts,
  mockTestimonials,
} from "@/lib/dev-mock-api";

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<
    ConsumerProfile | OrganizationProfile | null
  >(null);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "posts" | "stories" | "testimonials"
  >("overview");
  const [hoveredCert, setHoveredCert] = useState<Certificate | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const isOrg = profile && isOrganizationProfile(profile);
  const isConsumer = profile && isConsumerProfile(profile);

  useEffect(() => {
    if (userId) {
      loadPublicProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadPublicProfile = async () => {
    try {
      setIsLoading(true);

      // Fetch profile first to determine type - use mock data in dev mode
      // In dev mode, return mock profile for any userId
      const profileRes = await mockApiResponse(
        () => getPublicProfile(userId),
        // Default to organization profile, but check if userId matches consumer profile
        userId === "dev-consumer-456" || userId?.includes("consumer") 
          ? mockConsumerProfile 
          : mockProfile
      );

      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);

        // Load data based on profile type
        if (isOrganizationProfile(profileRes.data)) {
          // Load organization-specific data - use mock data in dev mode
          const [
            capabilitiesRes,
            certificatesRes,
            storiesRes,
            postsRes,
            testimonialsRes,
          ] = await Promise.all([
            mockApiResponse(() => getCapabilities(userId), {
              items: mockCapabilities,
              totalItems: mockCapabilities.length,
              totalPages: 1,
              page: 1,
              size: mockCapabilities.length,
            }),
            mockApiResponse(() => getCertificates(userId), {
              items: mockCertificates,
              totalItems: mockCertificates.length,
              totalPages: 1,
              page: 1,
              size: mockCertificates.length,
            }),
            mockApiResponse(() => getSuccessStories(userId), {
              items: mockSuccessStories,
              totalItems: mockSuccessStories.length,
              totalPages: 1,
              page: 1,
              size: mockSuccessStories.length,
            }),
            mockApiResponse(() => getPosts(userId), {
              items: mockPosts,
              totalItems: mockPosts.length,
              totalPages: 1,
              page: 1,
              size: mockPosts.length,
            }),
            mockApiResponse(() => getTestimonials(userId), {
              items: mockTestimonials,
              totalItems: mockTestimonials.length,
              totalPages: 1,
              page: 1,
              size: mockTestimonials.length,
            }),
          ]);

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
            setPosts((postsRes.data.items || []).slice(0, 5));
          }
          if (testimonialsRes.success && testimonialsRes.data) {
            setTestimonials(testimonialsRes.data.items || []);
          }
        } else if (isConsumerProfile(profileRes.data)) {
          // Load consumer-specific data (testimonials they wrote) - use mock data in dev mode
          const filteredTestimonials = mockTestimonials.filter((t) => t.consumerId === userId);
          const testimonialsRes = await mockApiResponse(
            () => getTestimonials(),
            {
              items: filteredTestimonials,
              totalItems: filteredTestimonials.length,
              totalPages: 1,
              page: 1,
              size: filteredTestimonials.length,
            }
          );

          if (testimonialsRes.success && testimonialsRes.data) {
            setTestimonials(testimonialsRes.data.items || []);
          }
        }
      }
    } catch (error) {
      logger.error("Error loading public profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIndustryName = (industryId: number) => {
    return `Industry ${industryId}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-body">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Not Found
          </h1>
          <p className="text-gray-600">
            The profile you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  // Note: Redirect to private profile if viewing own profile (requires user.id)
  // if (isOwnProfile) {
  //   router.push('/profile');
  //   return null;
  // }

  // Render Organization Profile
  if (isOrg) {
    const orgProfile = profile as OrganizationProfile;
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Cover Image - Behind header */}
        <div className="relative">
          {orgProfile.profileCoverId || orgProfile.coverImage ? (
            <div className="w-full h-64 relative">
              <Image
                src={getMediaUrl(
                  (orgProfile.profileCoverId || orgProfile.coverImage)!
                )}
                alt="Cover"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-linear-to-r from-primary to-primary-dark" />
          )}
        </div>

        {/* Header Section - Overlays cover */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative">
                <ProfileImage
                  imageId={orgProfile.profileImageId || orgProfile.profileImage}
                  displayName={orgProfile.displayName}
                  size="lg"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {orgProfile.displayName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  {orgProfile.industryId && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{getIndustryName(orgProfile.industryId)}</span>
                    </div>
                  )}
                  {orgProfile.size && <span>{orgProfile.size} employees</span>}
                  {orgProfile.city && orgProfile.country && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {orgProfile.city}
                        {orgProfile.state && `, ${orgProfile.state}`},{" "}
                        {orgProfile.country}
                      </span>
                    </div>
                  )}
                  {orgProfile.established && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Est. {orgProfile.established}</span>
                    </div>
                  )}
                </div>
                {orgProfile.website && (
                  <a
                    href={orgProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary-dark"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Visit Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg mt-4">
            <div className="border-b">
              <nav className="flex px-6">
                {[
                  { key: "overview", label: "Overview" },
                  { key: "posts", label: `Posts (${posts.length})` },
                  {
                    key: "stories",
                    label: `Success Stories (${successStories.length})`,
                  },
                  {
                    key: "testimonials",
                    label: `Reviews (${testimonials.length})`,
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content with Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* About Section */}
              {(orgProfile.whoWeAre || orgProfile.whatWeDo) && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    About
                  </h2>
                  {orgProfile.whoWeAre && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Who We Are
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {orgProfile.whoWeAre}
                      </p>
                    </div>
                  )}
                  {orgProfile.whatWeDo && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        What We Do
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {orgProfile.whatWeDo}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Capabilities */}
              {capabilities.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Capabilities
                  </h2>
                  <div className="space-y-3">
                    {capabilities.map((capability) => (
                      <div
                        key={capability.id}
                        className="border-l-4 border-primary pl-3"
                      >
                        <h3 className="text-sm font-semibold text-gray-800">
                          {capability.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {capability.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates with Hover */}
              {certificates.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Certificates
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {certificates.map((cert) => {
                      const cardContent = (
                        <>
                          {(cert.image?.id || cert.imageId) && (
                            <div className="relative h-20 mb-1 rounded overflow-hidden bg-gray-100">
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
                          <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">
                            {cert.title}
                          </h4>
                        </>
                      );

                      const hoverProps = {
                        onMouseEnter: (e: React.MouseEvent) => {
                          setHoveredCert(cert);
                          setMousePosition({ x: e.clientX, y: e.clientY });
                        },
                        onMouseMove: (e: React.MouseEvent) => {
                          setMousePosition({ x: e.clientX, y: e.clientY });
                        },
                        onMouseLeave: () => setHoveredCert(null),
                      };

                      if (cert.link) {
                        return (
                          <a
                            key={cert.id}
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border rounded-lg p-2 cursor-pointer hover:border-primary hover:shadow-md transition-all block"
                            {...hoverProps}
                          >
                            {cardContent}
                          </a>
                        );
                      }

                      return (
                        <div
                          key={cert.id}
                          className="border rounded-lg p-2 hover:border-primary hover:shadow-md transition-all cursor-pointer"
                          {...hoverProps}
                        >
                          {cardContent}
                        </div>
                      );
                    })}
                  </div>

                  {/* Hover Card */}
                  {hoveredCert && (
                    <div
                      className="fixed z-50 bg-white rounded-lg shadow-2xl p-4 w-64 pointer-events-none"
                      style={{
                        left: `${mousePosition.x + 20}px`,
                        top: `${mousePosition.y - 140}px`,
                        transform:
                          mousePosition.x > window.innerWidth - 300
                            ? "translateX(-100%) translateX(-40px)"
                            : "none",
                      }}
                    >
                      {hoveredCert.imageId && (
                        <div className="relative h-32 mb-3 rounded overflow-hidden">
                          <Image
                            src={getMediaUrl(hoveredCert.imageId)}
                            alt={hoveredCert.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-gray-900 mb-2">
                        {hoveredCert.title}
                      </h3>
                      {hoveredCert.body && (
                        <p className="text-sm text-gray-600 mb-2">
                          {hoveredCert.body}
                        </p>
                      )}
                      {hoveredCert.certificateDate && (
                        <p className="text-xs text-gray-500">
                          Issued:{" "}
                          {new Date(
                            hoveredCert.certificateDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Main Content - Tabbed */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Overview
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Welcome to {orgProfile.displayName}&apos;s profile.
                        Explore our posts, success stories, and reviews.
                      </p>
                    </div>

                    {/* Recent Posts Preview */}
                    {posts.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Latest Posts
                        </h3>
                        <PostsFeed posts={posts.slice(0, 3)} />
                        {posts.length > 3 && (
                          <button
                            onClick={() => setActiveTab("posts")}
                            className="mt-4 text-primary hover:text-primary-dark font-medium"
                          >
                            View all {posts.length} posts →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Posts Tab */}
                {activeTab === "posts" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      All Posts
                    </h2>
                    {posts.length > 0 ? (
                      <PostsFeed posts={posts} />
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No posts yet.
                      </p>
                    )}
                  </div>
                )}

                {/* Success Stories Tab */}
                {activeTab === "stories" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Success Stories
                    </h2>
                    {successStories.length > 0 ? (
                      <div className="space-y-6">
                        {successStories.map((story) => (
                          <div
                            key={story.id}
                            className="border-b pb-6 last:border-b-0"
                          >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {story.title}
                            </h3>
                            <p className="text-gray-600 mb-3">{story.body}</p>
                            {story.mediaIds && story.mediaIds.length > 0 && (
                              <div className="flex gap-2 flex-wrap">
                                {story.mediaIds
                                  .slice(0, 6)
                                  .map((mediaId: string) => (
                                    <div
                                      key={mediaId}
                                      className="relative w-32 h-32 rounded overflow-hidden"
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
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No success stories yet.
                      </p>
                    )}
                  </div>
                )}

                {/* Testimonials Tab */}
                {activeTab === "testimonials" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Reviews ({testimonials.length})
                    </h2>
                    {testimonials.length > 0 ? (
                      <div className="space-y-4">
                        {testimonials.map((testimonial) => (
                          <div
                            key={testimonial.id}
                            className="border-b pb-4 last:border-b-0"
                          >
                            <div className="flex items-center justify-between mb-2">
                              {testimonial.consumerId ? (
                                <Link
                                  href={`/profile/${testimonial.consumerId}`}
                                  className="font-semibold text-primary hover:text-primary-dark"
                                >
                                  {testimonial.consumerName}
                                </Link>
                              ) : (
                                <span className="font-semibold text-gray-800">
                                  {testimonial.consumerName}
                                </span>
                              )}
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
                              {new Date(
                                testimonial.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No reviews yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Consumer Profile
  if (isConsumer) {
    const consumerProfile = profile as ConsumerProfile;
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center space-x-6">
              <ProfileImage
                imageId={consumerProfile.profileImage}
                displayName={consumerProfile.displayName}
                size="lg"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {consumerProfile.displayName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {consumerProfile.industryId && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{getIndustryName(consumerProfile.industryId)}</span>
                    </div>
                  )}
                  {consumerProfile.city && consumerProfile.country && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {consumerProfile.city}
                        {consumerProfile.state &&
                          `, ${consumerProfile.state}`},{" "}
                        {consumerProfile.country}
                      </span>
                    </div>
                  )}
                  {consumerProfile.established && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {consumerProfile.established}</span>
                    </div>
                  )}
                </div>
                {consumerProfile.website && (
                  <a
                    href={consumerProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-primary hover:text-primary-dark"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Visit Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {consumerProfile.interests &&
                consumerProfile.interests.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Interests
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {consumerProfile.interests.map((interestId) => (
                        <span
                          key={interestId}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          Interest {interestId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {testimonials.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Reviews Written ({testimonials.length})
                  </h2>
                  <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="border-b last:border-b-0 pb-4 last:pb-0"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link
                              href={`/profile/${testimonial.organizationId}`}
                              className="font-medium text-primary hover:text-primary-dark"
                            >
                              {testimonial.organizationName}
                            </Link>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < testimonial.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(
                              testimonial.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{testimonial.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Activity
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Reviews Written
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {testimonials.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Interests</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {consumerProfile.interests?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
