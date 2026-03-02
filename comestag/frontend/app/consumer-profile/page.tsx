"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { getConsumerProfile, ConsumerProfile } from "@/lib/api/profile";
import { getTestimonialsIWrote, Testimonial } from "@/lib/api/content";
import {
  mockApiResponse,
  mockConsumerProfile,
  mockTestimonialsIWrote,
} from "@/lib/dev-mock-api";

import Button from "@/components/atoms/button";
import { ProfileImage } from "@/components/molecules/profile-card";

// Simple info item component for consumer profile
const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col space-y-1">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="text-sm text-gray-900">{value}</dd>
  </div>
);

export default function ConsumerProfilePage() {
  const { user } = useAuth(true);
  const router = useRouter();
  const [profile, setProfile] = useState<ConsumerProfile | null>(null);
  const [testimonialsIWrote, setTestimonialsIWrote] = useState<Testimonial[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "testimonials">(
    "overview"
  );

  const loadProfileData = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Load profile data
      try {
        const profileResponse = await mockApiResponse(
          () => getConsumerProfile(),
          mockConsumerProfile
        );
        if (profileResponse.success && profileResponse.data) {
          setProfile(profileResponse.data);
        } else {
          console.error("Failed to load profile:", profileResponse.message);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }

      // Load testimonials I wrote
      try {
        const testimonialsResponse = await mockApiResponse(
          () => getTestimonialsIWrote(),
          {
            items: mockTestimonialsIWrote,
            totalItems: mockTestimonialsIWrote.length,
            totalPages: 1,
            page: 1,
            size: mockTestimonialsIWrote.length,
          }
        );
        if (testimonialsResponse.success && testimonialsResponse.data?.items) {
          setTestimonialsIWrote(testimonialsResponse.data.items);
        } else {
          console.error(
            "Failed to load testimonials I wrote:",
            testimonialsResponse.message
          );
        }
      } catch (error) {
        console.error("Error loading testimonials:", error);
      }
    } catch (error) {
      console.error("Error loading consumer profile data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const getIndustryName = (industryId: number) => {
    // For now, return a placeholder. In production, you would load this from the industries API
    return `Industry ${industryId}`;
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Loading your profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Failed to load profile data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ProfileImage
                imageId={profile.profileImageId || profile.profileImage}
                displayName={profile.displayName}
                size="lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.displayName}
                </h1>
                <p className="text-gray-600">
                  {profile.industry?.name ||
                    (profile.industryId
                      ? getIndustryName(profile.industryId)
                      : "Industry not specified")}
                </p>
                <p className="text-sm text-gray-500">
                  {profile.city && profile.country
                    ? `${profile.city}, ${profile.country}`
                    : profile.country || "Location not specified"}
                </p>
              </div>
            </div>
            <Button onClick={() => router.push("/consumer-profile/edit")}>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { key: "overview", label: "Overview" },
              { key: "testimonials", label: "My Reviews" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Email" value={profile.email} />
                <InfoItem
                  label="Industry"
                  value={
                    profile.industry?.name ||
                    (profile.industryId
                      ? getIndustryName(profile.industryId)
                      : "Not specified")
                  }
                />
                <InfoItem
                  label="Country"
                  value={profile.country || "Not specified"}
                />
                <InfoItem
                  label="State/Province"
                  value={profile.state || "Not specified"}
                />
                <InfoItem
                  label="City"
                  value={profile.city || "Not specified"}
                />
                <InfoItem
                  label="Interests"
                  value={
                    profile.interests?.length
                      ? `${profile.interests.length} interests`
                      : "No interests specified"
                  }
                />
                <InfoItem
                  label="Company Size"
                  value={profile.size || "Not specified"}
                />
                <InfoItem
                  label="Established"
                  value={profile.established || "Not specified"}
                />
                <InfoItem
                  label="Website"
                  value={
                    profile.website ? (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {profile.website}
                      </a>
                    ) : (
                      "Not specified"
                    )
                  }
                />
              </dl>
            </div>
          </div>
        )}

        {activeTab === "testimonials" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reviews I&apos;ve Written
                </h2>
                <span className="text-sm text-gray-500">
                  {testimonialsIWrote.length} reviews
                </span>
              </div>

              {testimonialsIWrote.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven&apos;t written any reviews yet.</p>
                  <p className="text-sm mt-2">
                    Visit organization profiles to leave reviews.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {testimonialsIWrote.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">
                          {testimonial.organizationName || "Organization"}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? "text-yellow-400 fill-current"
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
                        <p className="text-gray-600 mb-2">
                          {testimonial.comment}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Written on{" "}
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
