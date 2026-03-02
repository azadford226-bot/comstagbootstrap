"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Star, MapPin, Globe, Calendar } from "lucide-react";
import Image from "next/image";
import { getOrganizationProfile, OrganizationProfile } from "@/lib/api/profile";
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
import {
  mockApiResponse,
  mockProfile,
  mockCapabilities,
  mockCertificates,
  mockSuccessStories,
  mockTestimonials,
  mockPosts,
} from "@/lib/dev-mock-api";

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
  const [hoveredCert, setHoveredCert] = useState<Certificate | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (_orgId) {
      loadPublicProfile();
    }
  }, [_orgId]);

  const loadPublicProfile = async () => {
    try {
      setIsLoading(true);

      // Fetch all public data for this organization
      const [
        profileRes,
        capabilitiesRes,
        certificatesRes,
        storiesRes,
        postsRes,
        testimonialsRes,
      ] = await Promise.all([
        mockApiResponse(getOrganizationProfile, mockProfile),
        mockApiResponse(getCapabilities, {
          items: mockCapabilities,
          totalItems: mockCapabilities.length,
          totalPages: 1,
          page: 1,
          size: mockCapabilities.length,
        }),
        mockApiResponse(getCertificates, {
          items: mockCertificates,
          totalItems: mockCertificates.length,
          totalPages: 1,
          page: 1,
          size: mockCertificates.length,
        }),
        mockApiResponse(getSuccessStories, {
          items: mockSuccessStories,
          totalItems: mockSuccessStories.length,
          totalPages: 1,
          page: 1,
          size: mockSuccessStories.length,
        }),
        mockApiResponse(getPosts, {
          items: mockPosts,
          totalItems: mockPosts.length,
          totalPages: 1,
          page: 1,
          size: mockPosts.length,
        }),
        mockApiResponse(getTestimonials, {
          items: mockTestimonials,
          totalItems: mockTestimonials.length,
          totalPages: 1,
          page: 1,
          size: mockTestimonials.length,
        }),
      ]);

      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {profile.displayName}
              </h1>

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

            <Button
              onClick={() => setShowTestimonialForm(true)}
              type="primary"
              size="small"
            >
              Write a Review
            </Button>
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
            {successStories.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Latest Posts
                </h2>
                <PostsFeed posts={getLatestPosts(posts, 2)} maxPosts={2} />
                {successStories.length > 2 && (
                  <div className="mt-4">
                    <p className="text-gray-600 text-sm">
                      View all {successStories.length} success stories below
                    </p>
                  </div>
                )}
              </div>
            )}

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
