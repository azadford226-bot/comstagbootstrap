"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import {
  getProfile,
  ConsumerProfile,
  OrganizationProfile,
  isOrganizationProfile,
} from "@/lib/api/profile";
import { getMyCapabilities, Capability } from "@/lib/api/capabilities";
import {
  getMyCertificates,
  Certificate,
  getMySuccessStories,
  SuccessStory,
  getTestimonialsAboutMe,
  Testimonial,
} from "@/lib/api/content";
import { getMyEvents, Event } from "@/lib/api/events";
import { getMyPosts, Post } from "@/lib/api/posts";
import { getMediaUrl } from "@/lib/api/media";
import { PostsFeed } from "@/components/ui/posts-feed";
import { fetchDynamicData, Industry } from "@/lib/locations";
import {
  mockApiResponse,
  mockProfile,
  mockCapabilities,
  mockCertificates,
  mockSuccessStories,
  mockEvents,
  mockTestimonials,
  mockPosts,
} from "@/lib/dev-mock-api";

import Button from "@/components/atoms/button";
import { ProfileImage, InfoItem } from "@/components/molecules/profile-card";
import {
  CoverImage,
  CapabilitiesSection,
  CertificatesSection,
  SuccessStoriesSection,
  EventsSection,
} from "@/components/organisms/profile-sections";

export default function ProfilePage() {
  const { user } = useAuth(true);
  const [profile, setProfile] = useState<
    ConsumerProfile | OrganizationProfile | null
  >(null);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "capabilities"
    | "certificates"
    | "stories"
    | "events"
    | "posts"
  >("overview");

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      const [
        profileRes,
        capabilitiesRes,
        certificatesRes,
        storiesRes,
        eventsRes,
        postsRes,
        testimonialsRes,
        dynamicData,
      ] = await Promise.all([
        mockApiResponse(getProfile, mockProfile),
        mockApiResponse(getMyCapabilities, {
          items: mockCapabilities,
          totalItems: mockCapabilities.length,
          totalPages: 1,
          page: 1,
          size: mockCapabilities.length,
        }),
        mockApiResponse(getMyCertificates, {
          items: mockCertificates,
          totalItems: mockCertificates.length,
          totalPages: 1,
          page: 1,
          size: mockCertificates.length,
        }),
        mockApiResponse(getMySuccessStories, {
          items: mockSuccessStories,
          totalItems: mockSuccessStories.length,
          totalPages: 1,
          page: 1,
          size: mockSuccessStories.length,
        }),
        mockApiResponse(getMyEvents, {
          items: mockEvents,
          totalItems: mockEvents.length,
          totalPages: 1,
          page: 1,
          size: mockEvents.length,
        }),
        mockApiResponse(getMyPosts, {
          items: mockPosts,
          totalItems: mockPosts.length,
          totalPages: 1,
          page: 1,
          size: mockPosts.length,
        }),
        mockApiResponse(getTestimonialsAboutMe, {
          items: mockTestimonials,
          totalItems: mockTestimonials.length,
          totalPages: 1,
          page: 1,
          size: mockTestimonials.length,
        }),
        fetchDynamicData(),
      ]);

      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);
      }

      if (capabilitiesRes.success && capabilitiesRes.data) {
        setCapabilities(
          Array.isArray(capabilitiesRes.data)
            ? capabilitiesRes.data
            : capabilitiesRes.data.items || []
        );
      }

      if (certificatesRes.success && certificatesRes.data) {
        setCertificates(
          Array.isArray(certificatesRes.data)
            ? certificatesRes.data
            : certificatesRes.data.items || []
        );
      }

      if (storiesRes.success && storiesRes.data) {
        setSuccessStories(
          Array.isArray(storiesRes.data)
            ? storiesRes.data
            : storiesRes.data.items || []
        );
      }

      if (eventsRes.success && eventsRes.data) {
        setEvents(
          Array.isArray(eventsRes.data)
            ? eventsRes.data
            : eventsRes.data.items || []
        );
      }

      if (postsRes.success && postsRes.data) {
        setPosts(
          Array.isArray(postsRes.data)
            ? postsRes.data
            : postsRes.data.items || []
        );
      }

      if (testimonialsRes.success && testimonialsRes.data) {
        const allTestimonials = Array.isArray(testimonialsRes.data)
          ? testimonialsRes.data
          : testimonialsRes.data.items || [];
        // Filter to only show testimonials for this organization
        const orgTestimonials = profile?.id
          ? allTestimonials.filter((t) => t.organizationId === profile.id)
          : allTestimonials;
        setTestimonials(orgTestimonials);
      }

      if (dynamicData) {
        setIndustries(dynamicData.industries);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const getIndustryName = (industryId: number | string) => {
    const industry = industries.find((ind) => ind.id === Number(industryId));
    return industry?.name || "Unknown";
  };

  const getProfileIndustryName = () => {
    if (profile?.industry) {
      return profile.industry.name;
    }
    if (profile?.industryId) {
      return getIndustryName(profile.industryId);
    }
    return "Unknown";
  };

  if (!user) {
    return null;
  }

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CoverImage imageId={profile?.profileCoverId || profile?.coverImage} />

      {/* Profile Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative -mt-20 md:-mt-24">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="shrink-0">
                <ProfileImage
                  imageId={profile?.profileImageId || profile?.profileImage}
                  displayName={profile?.displayName || user.name}
                  size="md"
                />
              </div>

              {/* Organization Info */}
              <div className="flex-1">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary-dark">
                      {profile?.displayName || user.name}
                    </h1>

                    {/* Action Buttons - Top Right on Desktop */}
                    <div className="flex flex-wrap gap-2 sm:shrink-0">
                      <Button
                        onClick={() => {
                          if (profile?.id) {
                            window.location.href = `/profile/${profile.id}`;
                          }
                        }}
                        type="secondary"
                        size="small"
                        className="gap-1.5"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span className="hidden sm:inline">View Public</span>
                        <span className="sm:hidden">Public</span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = "/profile/edit")}
                        type="primary"
                        size="small"
                        className="gap-1.5"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span className="hidden sm:inline">Edit Profile</span>
                        <span className="sm:hidden">Edit</span>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-4">
                      {(profile?.industryId || profile?.industry) && (
                        <InfoItem icon="briefcase">
                          <span className="font-medium">
                            {getProfileIndustryName()}
                          </span>
                        </InfoItem>
                      )}
                      {profile?.size && (
                        <InfoItem icon="users">
                          {profile.size} employees
                        </InfoItem>
                      )}
                      {profile?.established && (
                        <InfoItem icon="calendar">
                          Est. {profile.established}
                        </InfoItem>
                      )}
                    </div>
                    {profile?.city && profile?.country && (
                      <div className="mt-2">
                        <InfoItem icon="location">
                          {profile.city}
                          {profile.state && `, ${profile.state}`},{" "}
                          {profile.country}
                        </InfoItem>
                      </div>
                    )}
                    {profile?.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block"
                      >
                        <InfoItem icon="globe">
                          <span className="text-primary hover:text-primary-dark">
                            Visit Website
                          </span>
                        </InfoItem>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Compact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* About Section - Only for Organizations */}
            {profile &&
              isOrganizationProfile(profile) &&
              (profile.whoWeAre || profile.whatWeDo) && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-primary-dark mb-4">
                    About Us
                  </h2>
                  {profile.whoWeAre && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-text-dark mb-2">
                        Who We Are
                      </h3>
                      <p className="text-sm text-text-body leading-relaxed">
                        {profile.whoWeAre}
                      </p>
                    </div>
                  )}
                  {profile.whatWeDo && (
                    <div>
                      <h3 className="text-sm font-semibold text-text-dark mb-2">
                        What We Do
                      </h3>
                      <p className="text-sm text-text-body leading-relaxed">
                        {profile.whatWeDo}
                      </p>
                    </div>
                  )}
                </div>
              )}

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-4">
                Quick Stats
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-body">Capabilities</span>
                  <span className="text-lg font-bold text-primary">
                    {capabilities.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-body">Certificates</span>
                  <span className="text-lg font-bold text-primary">
                    {certificates.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-body">
                    Success Stories
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {successStories.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-body">Events</span>
                  <span className="text-lg font-bold text-primary">
                    {events.length}
                  </span>
                </div>
                {testimonials.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-body">Reviews</span>
                    <span className="text-lg font-bold text-primary">
                      {testimonials.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area with Tabs */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="bg-white rounded-t-xl shadow-md border-b border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === "overview"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("capabilities")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === "capabilities"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Capabilities ({capabilities.length})
                </button>
                <button
                  onClick={() => setActiveTab("certificates")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === "certificates"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Certificates ({certificates.length})
                </button>
                <button
                  onClick={() => setActiveTab("stories")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === "stories"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Success Stories ({successStories.length})
                </button>
                <button
                  onClick={() => setActiveTab("events")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === "events"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Events ({events.length})
                </button>
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === "posts"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Posts ({posts.length})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-xl shadow-md p-6 min-h-[500px]">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">
                      Profile Overview
                    </h2>
                    <p className="text-text-body mb-6">
                      Welcome to your profile dashboard. Use the tabs above to
                      manage your capabilities, certificates, success stories,
                      and events.
                    </p>
                  </div>

                  {/* Latest Posts */}
                  {posts.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-text-dark mb-4">
                        Latest Posts
                      </h3>
                      <PostsFeed posts={posts.slice(0, 3)} />
                      {posts.length > 3 && (
                        <div className="mt-4">
                          <button
                            onClick={() => setActiveTab("posts")}
                            className="text-primary hover:text-primary-dark text-sm font-medium"
                          >
                            View all {posts.length} posts →
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    {successStories.length > 0 && (
                      <div className="mb-4">
                        <button
                          onClick={() => setActiveTab("stories")}
                          className="text-primary hover:text-primary-dark text-sm font-medium"
                        >
                          View success stories →
                        </button>
                      </div>
                    )}
                    {events.length > 0 && (
                      <div className="mb-4">
                        <button
                          onClick={() => setActiveTab("events")}
                          className="text-primary hover:text-primary-dark text-sm font-medium"
                        >
                          View events →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Recent Capabilities */}
                  {capabilities.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-text-dark mb-4">
                        Recent Capabilities
                      </h3>
                      <div className="grid gap-4">
                        {capabilities.slice(0, 3).map((capability) => (
                          <div
                            key={capability.id}
                            className="border-l-4 border-primary bg-gray-50 p-4 rounded-r"
                          >
                            <h4 className="font-semibold text-text-dark mb-1">
                              {capability.title}
                            </h4>
                            <p className="text-sm text-text-body">
                              {capability.body}
                            </p>
                          </div>
                        ))}
                      </div>
                      {capabilities.length > 3 && (
                        <button
                          onClick={() => setActiveTab("capabilities")}
                          className="mt-4 text-primary hover:text-primary-dark text-sm font-medium"
                        >
                          View all {capabilities.length} capabilities →
                        </button>
                      )}
                    </div>
                  )}

                  {/* Recent Success Stories with Media */}
                  {successStories.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-text-dark mb-4">
                        Recent Success Stories
                      </h3>
                      <div className="grid gap-6">
                        {successStories.slice(0, 2).map((story) => (
                          <div
                            key={story.id}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <h4 className="font-semibold text-text-dark mb-2">
                              {story.title}
                            </h4>
                            <p className="text-sm text-text-body mb-3 line-clamp-2">
                              {story.body}
                            </p>
                            {story.mediaIds && story.mediaIds.length > 0 && (
                              <div className="grid grid-cols-3 gap-2">
                                {story.mediaIds.slice(0, 3).map((mediaId) => (
                                  <div
                                    key={mediaId}
                                    className="relative aspect-video bg-gray-200 rounded overflow-hidden"
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
                                {story.mediaIds.length > 3 && (
                                  <div className="relative aspect-video bg-gray-200 rounded flex items-center justify-center">
                                    <span className="text-xs text-gray-600">
                                      +{story.mediaIds.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {successStories.length > 2 && (
                        <button
                          onClick={() => setActiveTab("stories")}
                          className="mt-4 text-primary hover:text-primary-dark text-sm font-medium"
                        >
                          View all {successStories.length} success stories →
                        </button>
                      )}
                    </div>
                  )}

                  {/* Testimonials */}
                  {testimonials.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-text-dark mb-4">
                        Recent Reviews
                      </h3>
                      <div className="space-y-4">
                        {testimonials.slice(0, 2).map((testimonial) => (
                          <div
                            key={testimonial.id}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              {testimonial.consumerId ? (
                                <Link
                                  href={`/profile/${testimonial.consumerId}`}
                                  className="font-semibold text-primary hover:text-primary-dark"
                                >
                                  {testimonial.consumerName || "Anonymous"}
                                </Link>
                              ) : (
                                <span className="font-semibold text-text-dark">
                                  {testimonial.consumerName || "Anonymous"}
                                </span>
                              )}
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < testimonial.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            {testimonial.comment && (
                              <p className="text-sm text-text-body">
                                {testimonial.comment}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Capabilities Tab */}
              {activeTab === "capabilities" && (
                <div>
                  <CapabilitiesSection
                    capabilities={capabilities}
                    onUpdate={loadData}
                  />
                </div>
              )}

              {/* Certificates Tab */}
              {activeTab === "certificates" && (
                <div>
                  <CertificatesSection
                    certificates={certificates}
                    onUpdate={loadData}
                  />
                </div>
              )}

              {/* Success Stories Tab */}
              {activeTab === "stories" && (
                <div>
                  <SuccessStoriesSection
                    stories={successStories}
                    onUpdate={loadData}
                  />
                </div>
              )}

              {/* Events Tab */}
              {activeTab === "events" && (
                <div>
                  <EventsSection events={events} onUpdate={loadData} />
                </div>
              )}

              {/* Posts Tab */}
              {activeTab === "posts" && (
                <div>
                  <PostsFeed
                    posts={posts}
                    enableCRUD={true}
                    onUpdate={loadData}
                    showFullContent={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
