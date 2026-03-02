"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getOrganizationProfile,
  updateOrganizationProfile,
  uploadProfileImage,
  uploadCoverImage,
} from "@/lib/api/profile";
import FormInput from "@/components/atoms/form_input";
import IndustrySelect from "@/components/atoms/industry_select";
import CompanySizeSelect from "@/components/atoms/company_size_select";
import CountryCitySelect from "@/components/molecules/country_city_select";
import { logger } from "@/lib/logger";
import { Upload } from "lucide-react";
import { mockApiResponse, mockProfile } from "@/lib/dev-mock-api";
import { getMediaUrl } from "@/lib/api/media";
import { AuthenticatedImage } from "@/components/atoms/authenticated-image";

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "",
    industryId: 0,
    size: "",
    established: "",
    website: "",
    country: "",
    state: "",
    city: "",
    whoWeAre: "",
    whatWeDo: "",
  });

  const [profileImage, setProfileImage] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const result = await mockApiResponse(getOrganizationProfile, mockProfile);
      if (result.success && result.data) {
        const profile = result.data;
        // Handle both industryId (number) and industry (object) formats
        const industryId = profile.industry?.id || profile.industryId || 0;
        setFormData({
          displayName: profile.displayName || "",
          industryId: industryId,
          size: profile.size || "",
          established: profile.established || "",
          website: profile.website || "",
          country: profile.country || "",
          state: profile.state || "",
          city: profile.city || "",
          whoWeAre: profile.whoWeAre || "",
          whatWeDo: profile.whatWeDo || "",
        });
        setProfileImage(profile.profileImageId || profile.profileImage || "");
        setCoverImage(profile.profileCoverId || profile.coverImage || "");
      }
    } catch (error) {
      logger.error("Failed to load profile", error);
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadingProfile(true);
    try {
      const result = await uploadProfileImage(file);
      if (result.success && result.data) {
        setProfileImage(result.data.mediaId);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.message || "Failed to upload profile image");
      }
    } catch (error) {
      logger.error("Profile image upload failed", error);
      setError("Failed to upload profile image");
    } finally {
      setUploadingProfile(false);
      // Reset file input to allow re-selecting the same file
      e.target.value = "";
    }
  };

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadingCover(true);
    try {
      const result = await uploadCoverImage(file);
      if (result.success && result.data) {
        setCoverImage(result.data.mediaId);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.message || "Failed to upload cover image");
      }
    } catch (error) {
      logger.error("Cover image upload failed", error);
      setError("Failed to upload cover image");
    } finally {
      setUploadingCover(false);
      // Reset file input to allow re-selecting the same file
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const result = await updateOrganizationProfile(formData);
      if (!result.success) {
        setError(result.message || "Failed to update profile");
        setIsSaving(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (error) {
      logger.error("Profile update failed", error);
      setError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-primary-dark">
              Edit Profile
            </h1>
          </div>

          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Profile updated successfully!
            </div>
          )}

          {/* Cover Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
              {coverImage && (
                <AuthenticatedImage
                  src={getMediaUrl(coverImage)}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-gray-400 bg-opacity-30 cursor-pointer hover:bg-opacity-40 transition-all">
                <div className="text-white text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <span>
                    {uploadingCover
                      ? "Uploading..."
                      : "Click to upload cover image"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="hidden"
                  disabled={uploadingCover}
                />
              </label>
            </div>
          </div>

          {/* Profile Image Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                {profileImage && (
                  <AuthenticatedImage
                    src={getMediaUrl(profileImage)}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-700 bg-white px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                <span>
                  {uploadingProfile ? "Uploading..." : "Choose Profile Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                  disabled={uploadingProfile}
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Organization Name"
              name="displayName"
              placeholder="Enter organization name"
              value={formData.displayName}
              onChange={handleInputChange}
              required
            />

            <IndustrySelect
              name="industryId"
              value={formData.industryId}
              onChange={handleInputChange}
              required
            />

            <CompanySizeSelect
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Establishment Date"
              name="established"
              placeholder="MM/DD/YYYY"
              type="date"
              value={formData.established}
              onChange={handleInputChange}
              max={new Date().toISOString().split("T")[0]}
            />

            <FormInput
              label="Website"
              name="website"
              placeholder="https://www.example.com"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
            />

            <CountryCitySelect
              countryValue={formData.country}
              stateValue={formData.state}
              cityValue={formData.city}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Who We Are"
              name="whoWeAre"
              placeholder="Tell us about your organization"
              isTextarea
              value={formData.whoWeAre}
              onChange={handleInputChange}
            />

            <FormInput
              label="What We Do"
              name="whatWeDo"
              placeholder="Describe what your organization does"
              isTextarea
              value={formData.whatWeDo}
              onChange={handleInputChange}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
