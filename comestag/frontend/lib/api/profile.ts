import { authenticatedGet, authenticatedPut } from "./api-client";
import { logger } from "@/lib/logger";
import { PROFILE_ENDPOINTS, MEDIA_ENDPOINTS } from "./endpoints";

// Profile types
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  profileImage?: string;
  profileImageId?: string; // API returns this
  coverImage?: string;
  profileCoverId?: string; // API returns this
  // Add more fields as needed based on API response
}

export interface ConsumerProfile extends UserProfile {
  industryId?: number;
  industry?: { id: number; name: string }; // API returns this format
  interests: number[];
  country: string;
  state?: string;
  city: string;
  size: string;
  established: string;
  website: string;
}

export interface OrganizationProfile extends UserProfile {
  industryId?: number;
  industry?: { id: number; name: string }; // API returns this format
  size: string;
  country: string;
  state?: string;
  city: string;
  established: string;
  website: string;
  whoWeAre: string;
  whatWeDo: string;
}

export interface UpdateConsumerProfileRequest {
  displayName?: string;
  industryId?: number;
  interests?: number[];
  country?: string;
  state?: string;
  city?: string;
  size?: string;
  established?: string;
  website?: string;
}

export interface UpdateOrganizationProfileRequest {
  displayName?: string;
  industryId?: number;
  size?: string;
  country?: string;
  state?: string;
  city?: string;
  established?: string;
  website?: string;
  whoWeAre?: string;
  whatWeDo?: string;
}

export interface UpdateEmailRequest {
  newEmail: string;
  verificationCode: string; // Required per Swagger spec (line 1896-1901)
}

/**
 * Get current authenticated user's profile
 * Returns either ConsumerProfile or OrganizationProfile based on user type
 */
export async function getProfile() {
  logger.info("Fetching user profile");
  const result = await authenticatedGet<{
    userDetails: ConsumerProfile | OrganizationProfile;
  }>(PROFILE_ENDPOINTS.BASE);

  // API returns data wrapped in userDetails, extract it
  if (result.success && result.data && "userDetails" in result.data) {
    return {
      ...result,
      data: result.data.userDetails,
    };
  }

  return result as {
    success: boolean;
    data?: ConsumerProfile | OrganizationProfile;
    message?: string;
    status?: number;
  };
}

/**
 * Get consumer profile (current authenticated consumer user)
 * Uses the base profile endpoint - returns ConsumerProfile for consumer users
 */
export async function getConsumerProfile() {
  logger.info("Fetching consumer profile");
  const result = await authenticatedGet<{ userDetails: ConsumerProfile }>(
    PROFILE_ENDPOINTS.BASE
  );

  // API returns data wrapped in userDetails, extract it
  if (result.success && result.data && "userDetails" in result.data) {
    return {
      ...result,
      data: result.data.userDetails,
    };
  }

  return result as {
    success: boolean;
    data?: ConsumerProfile;
    message?: string;
    status?: number;
  };
}

/**
 * Get organization profile (current authenticated organization user)
 * Uses the base profile endpoint - returns OrganizationProfile for organization users
 */
export async function getOrganizationProfile() {
  logger.info("Fetching organization profile");
  const result = await authenticatedGet<{ userDetails: OrganizationProfile }>(
    PROFILE_ENDPOINTS.BASE
  );

  // API returns data wrapped in userDetails, extract it
  if (result.success && result.data && "userDetails" in result.data) {
    return {
      ...result,
      data: result.data.userDetails,
    };
  }

  return result as {
    success: boolean;
    data?: OrganizationProfile;
    message?: string;
    status?: number;
  };
}

/**
 * Get public profile by user ID (works for both consumers and organizations)
 * Note: This uses the base profile endpoint which returns the appropriate profile type
 */
export async function getPublicProfile(userId: string) {
  logger.info("Fetching public profile", { userId });
  const result = await authenticatedGet<{
    userDetails: ConsumerProfile | OrganizationProfile;
  }>(`${PROFILE_ENDPOINTS.BASE}/${userId}`);

  // API returns data wrapped in userDetails, extract it
  if (result.success && result.data && "userDetails" in result.data) {
    return {
      ...result,
      data: result.data.userDetails,
    };
  }

  return result as {
    success: boolean;
    data?: ConsumerProfile | OrganizationProfile;
    message?: string;
    status?: number;
  };
}

/**
 * Helper function to determine if a profile is an organization profile
 */
export function isOrganizationProfile(
  profile: ConsumerProfile | OrganizationProfile
): profile is OrganizationProfile {
  return "whoWeAre" in profile || "whatWeDo" in profile;
}

/**
 * Helper function to determine if a profile is a consumer profile
 */
export function isConsumerProfile(
  profile: ConsumerProfile | OrganizationProfile
): profile is ConsumerProfile {
  return "interests" in profile;
}

/**
 * Update consumer profile
 */
export async function updateConsumerProfile(
  data: UpdateConsumerProfileRequest
) {
  logger.info("Updating consumer profile");
  return authenticatedPut<ConsumerProfile>(PROFILE_ENDPOINTS.CONSUMER, data);
}

/**
 * Update organization profile
 */
export async function updateOrganizationProfile(
  data: UpdateOrganizationProfileRequest
) {
  logger.info("Updating organization profile");
  return authenticatedPut<OrganizationProfile>(
    PROFILE_ENDPOINTS.ORGANIZATION,
    data
  );
}

/**
 * Update user email
 */
export async function updateEmail(data: UpdateEmailRequest) {
  logger.info("Updating user email");
  return authenticatedPut(PROFILE_ENDPOINTS.EMAIL, data);
}

/**
 * Upload profile image using the correct POST then PUT flow
 */
export async function uploadProfileImage(file: File) {
  try {
    logger.info("Uploading profile image");

    // Step 1: Upload the file to get media ID
    const formData = new FormData();
    formData.append("file", file);

    const { authenticatedFetch } = await import("./api-client");

    const uploadResponse = await authenticatedFetch(
      MEDIA_ENDPOINTS.PROFILE_IMAGE,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || "Image upload failed",
      };
    }

    const uploadResult = await uploadResponse.json();
    logger.debug("Profile image upload result", uploadResult);

    // API returns media ID as a plain string like "70229a35-d96d-4a96-8667-47e8a612d59c"
    // or possibly as an object with mediaId/id property
    let mediaId: string;

    if (typeof uploadResult === "string") {
      mediaId = uploadResult;
    } else if (typeof uploadResult === "object" && uploadResult !== null) {
      mediaId =
        uploadResult.mediaId ||
        uploadResult.id ||
        Object.values(uploadResult)[0];
    } else {
      mediaId = "";
    }

    if (!mediaId || typeof mediaId !== "string") {
      logger.error("Invalid media ID in response", { uploadResult });
      return {
        success: false,
        message: "No media ID returned from upload",
      };
    }

    // Step 2: Update the profile with the media ID (as query parameter)
    logger.info("Updating profile with media ID", { mediaId });
    const updateResponse = await authenticatedFetch(
      `${PROFILE_ENDPOINTS.IMAGE}?mediaId=${mediaId}`,
      {
        method: "PUT",
      }
    );

    logger.debug("Profile update response status", {
      status: updateResponse.status,
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText };
      }
      logger.error("Profile image update failed", {
        error,
        status: updateResponse.status,
        errorText,
        mediaId,
        endpoint: PROFILE_ENDPOINTS.IMAGE,
        headers: updateResponse.headers,
      });
      return {
        success: false,
        message: error.message || `Profile image update failed (${updateResponse.status})`,
      };
    }

    const updateResult = await updateResponse.json().catch(() => ({}));
    logger.debug("Profile update result", { updateResult });

    return {
      success: true,
      data: { ...updateResult, mediaId },
      message: "Profile image updated successfully",
    };
  } catch (error) {
    logger.error("Profile image upload error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Upload cover image using the correct POST then PUT flow
 */
export async function uploadCoverImage(file: File) {
  try {
    logger.info("Uploading cover image");

    // Step 1: Upload the file to get media ID
    const formData = new FormData();
    formData.append("file", file);

    const { authenticatedFetch } = await import("./api-client");

    const uploadResponse = await authenticatedFetch(
      MEDIA_ENDPOINTS.PROFILE_COVER,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json().catch(() => ({}));
      logger.error("Cover image POST failed", {
        status: uploadResponse.status,
        error,
      });
      return {
        success: false,
        message: error.message || `Cover image upload failed (${uploadResponse.status})`,
      };
    }

    const uploadResult = await uploadResponse.json();
    logger.debug("Cover image upload result", uploadResult);

    // API returns media ID as a plain string like "70229a35-d96d-4a96-8667-47e8a612d59c"
    // or possibly as an object with mediaId/id property
    let mediaId: string;

    if (typeof uploadResult === "string") {
      mediaId = uploadResult;
    } else if (typeof uploadResult === "object" && uploadResult !== null) {
      mediaId =
        uploadResult.mediaId ||
        uploadResult.id ||
        Object.values(uploadResult)[0];
    } else {
      mediaId = "";
    }

    if (!mediaId || typeof mediaId !== "string") {
      logger.error("Invalid media ID in response", { uploadResult });
      return {
        success: false,
        message: "No media ID returned from upload",
      };
    }

    // Step 2: Update the profile with the media ID (as query parameter)
    logger.info("Updating profile with cover media ID", { mediaId });
    const updateResponse = await authenticatedFetch(
      `${PROFILE_ENDPOINTS.COVER}?mediaId=${mediaId}`,
      {
        method: "PUT",
      }
    );

    logger.debug("Cover update response status", {
      status: updateResponse.status,
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText };
      }
      logger.error("Cover image update failed", {
        error,
        status: updateResponse.status,
        errorText,
        mediaId,
        endpoint: PROFILE_ENDPOINTS.COVER,
      });
      return {
        success: false,
        message: error.message || `Cover image update failed (${updateResponse.status})`,
      };
    }

    const updateResult = await updateResponse.json().catch(() => ({}));
    logger.debug("Cover update result", { updateResult });

    return {
      success: true,
      data: { ...updateResult, mediaId },
      message: "Cover image updated successfully",
    };
  } catch (error) {
    logger.error("Cover image upload error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Upload failed",
    };
  }
}
