"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  getConsumerProfile,
  updateConsumerProfile,
  ConsumerProfile,
  UpdateConsumerProfileRequest,
} from "@/lib/api/profile";
import {
  uploadProfileMedia,
  uploadCoverMedia,
  updateProfileImage,
  updateProfileCover,
} from "@/lib/api/media";
import { mockApiResponse, mockConsumerProfile } from "@/lib/dev-mock-api";

import Button from "@/components/atoms/button";
import { ProfileImage } from "@/components/molecules/profile-card";

export default function EditConsumerProfilePage() {
  const { user } = useAuth(true);
  const router = useRouter();
  const [profile, setProfile] = useState<ConsumerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateConsumerProfileRequest>({});

  const loadProfile = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await mockApiResponse(
        () => getConsumerProfile(),
        mockConsumerProfile
      );
      if (response.success && response.data) {
        setProfile(response.data);
        setFormData({
          displayName: response.data.displayName,
          industryId: response.data.industryId,
          interests: response.data.interests,
          country: response.data.country,
          state: response.data.state,
          city: response.data.city,
          size: response.data.size,
          established: response.data.established,
          website: response.data.website,
        });
      } else {
        console.error("Failed to load profile:", response.message);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "industryId" ? parseInt(value) : value,
    }));
  };

  const handleImageUpload = async (file: File, type: "profile" | "cover") => {
    try {
      setIsSaving(true);

      // Step 1: Upload the image
      const uploadResponse =
        type === "profile"
          ? await uploadProfileMedia(file)
          : await uploadCoverMedia(file);

      if (!uploadResponse.success) {
        alert(`Failed to upload ${type} image: ${uploadResponse.message}`);
        return;
      }

      // Step 2: Update the profile with the image
      // Handle different possible response formats
      const imageId = uploadResponse.data?.imageId || uploadResponse.data?.id || uploadResponse.data;
      if (!imageId) {
        alert(`Invalid response format from ${type} image upload`);
        return;
      }

      const updateResponse =
        type === "profile"
          ? await updateProfileImage(imageId)
          : await updateProfileCover(imageId);

      if (updateResponse.success) {
        // Refresh profile to show new image
        await loadProfile();
      } else {
        alert(`Failed to update ${type} image: ${updateResponse.message}`);
      }
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      alert(`Error uploading ${type} image. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const response = await updateConsumerProfile(formData);

      if (response.success) {
        router.push("/consumer-profile");
      } else {
        alert(`Failed to update profile: ${response.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          Please log in to edit your profile.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Failed to load profile. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <div className="space-x-2">
              <Button
                onClick={() => router.push("/consumer-profile")}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSubmit({} as React.FormEvent)}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Profile Image
            </h2>
            <div className="flex items-center space-x-4">
              <ProfileImage
                imageId={profile.profileImageId || profile.profileImage}
                displayName={profile.displayName}
                size="lg"
              />
              <div>
                <label className="block">
                  <span className="sr-only">Choose profile image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, "profile");
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="industryId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Industry ID
                </label>
                <input
                  type="number"
                  id="industryId"
                  name="industryId"
                  value={formData.industryId || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State/Province
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="size"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Size
                </label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  value={formData.size || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="established"
                  className="block text-sm font-medium text-gray-700"
                >
                  Established
                </label>
                <input
                  type="text"
                  id="established"
                  name="established"
                  value={formData.established || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => router.push("/consumer-profile")}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                disabled={isSaving}
                onClick={() => handleSubmit({} as React.FormEvent)}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
