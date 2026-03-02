import { authenticatedGet } from "./api-client";
import { logger } from "@/lib/logger";
import { MEDIA_ENDPOINTS } from "./endpoints";

/**
 * Upload media files for success story
 * Accepts multiple files (up to 20 files, 10MB each)
 * Returns array of media IDs
 */
export async function uploadSuccessStoryMedia(files: File | File[]) {
  try {
    const fileArray = Array.isArray(files) ? files : [files];

    logger.info("Uploading success story media", {
      count: fileArray.length,
      fileNames: fileArray.map((f) => f.name),
    });

    // Validate file count
    if (fileArray.length > 20) {
      return {
        success: false,
        message: "Maximum 20 files allowed per upload",
        data: { mediaIds: [] },
      };
    }

    // Validate file sizes
    const oversizedFiles = fileArray.filter((f) => f.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      return {
        success: false,
        message: `Files exceed 10MB limit: ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}`,
        data: { mediaIds: [] },
      };
    }

    const formData = new FormData();
    fileArray.forEach((file) => {
      formData.append("files", file);
    });

    const { authenticatedFetch } = await import("./api-client");

    const response = await authenticatedFetch(MEDIA_ENDPOINTS.SUCCESS_STORY, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || "Media upload failed",
        data: { mediaIds: [] },
      };
    }

    const result = await response.json();

    // Handle both single ID and array of IDs response formats
    let mediaIds: string[];
    if (Array.isArray(result)) {
      mediaIds = result.map((item) => item.id || item);
    } else if (result.mediaIds && Array.isArray(result.mediaIds)) {
      mediaIds = result.mediaIds;
    } else if (result.id) {
      mediaIds = [result.id];
    } else {
      mediaIds = [];
    }

    return {
      success: true,
      data: { mediaIds },
      message: `Successfully uploaded ${mediaIds.length} file${
        mediaIds.length !== 1 ? "s" : ""
      }`,
    };
  } catch (error) {
    logger.error("Success story media upload error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Upload failed",
      data: { mediaIds: [] },
    };
  }
}

/**
 * Upload media files for posts
 * Accepts multiple files (up to 20 files, 10MB each)
 * Returns array of media IDs
 */
export async function uploadPostMedia(files: File | File[]) {
  try {
    const fileArray = Array.isArray(files) ? files : [files];

    logger.info("Uploading post media", {
      count: fileArray.length,
      fileNames: fileArray.map((f) => f.name),
    });

    // Validate file count
    if (fileArray.length > 20) {
      return {
        success: false,
        message: "Maximum 20 files allowed per upload",
        data: { mediaIds: [] },
      };
    }

    // Validate file sizes
    const oversizedFiles = fileArray.filter((f) => f.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      return {
        success: false,
        message: `Files exceed 10MB limit: ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}`,
        data: { mediaIds: [] },
      };
    }

    const formData = new FormData();
    fileArray.forEach((file) => {
      formData.append("files", file);
    });

    const { authenticatedFetch } = await import("./api-client");

    const response = await authenticatedFetch(MEDIA_ENDPOINTS.POST, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || "Media upload failed",
        data: { mediaIds: [] },
      };
    }

    const result = await response.json();

    // Handle both single ID and array of IDs response formats
    let mediaIds: string[];
    if (Array.isArray(result)) {
      mediaIds = result.map((item) => item.id || item);
    } else if (result.mediaIds && Array.isArray(result.mediaIds)) {
      mediaIds = result.mediaIds;
    } else if (result.id) {
      mediaIds = [result.id];
    } else {
      mediaIds = [];
    }

    return {
      success: true,
      data: { mediaIds },
      message: `Successfully uploaded ${mediaIds.length} file${
        mediaIds.length !== 1 ? "s" : ""
      }`,
    };
  } catch (error) {
    logger.error("Post media upload error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Upload failed",
      data: { mediaIds: [] },
    };
  }
}

/**
 * Upload certificate image
 */
export async function uploadCertificateMedia(file: File) {
  try {
    logger.info("Uploading certificate media");

    const formData = new FormData();
    formData.append("file", file);

    const { authenticatedFetch } = await import("./api-client");

    const response = await authenticatedFetch(MEDIA_ENDPOINTS.CERTIFICATE, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error("Certificate media upload failed", {
        status: response.status,
        error,
      });
      return {
        success: false,
        message: error.message || "Media upload failed",
      };
    }

    const result = await response.json();
    logger.debug("Certificate media upload result", result);

    // Handle different response formats - API may return string ID or object
    let mediaId: string;
    if (typeof result === "string") {
      mediaId = result;
    } else if (typeof result === "object" && result !== null) {
      mediaId = result.mediaId || result.id || Object.values(result)[0];
    } else {
      mediaId = "";
    }

    if (!mediaId || typeof mediaId !== "string") {
      logger.error("Invalid media ID in certificate upload response", { result });
      return {
        success: false,
        message: "No media ID returned from upload",
      };
    }

    return {
      success: true,
      data: { id: mediaId, mediaId }, // Return both formats for compatibility
      message: "Certificate media uploaded successfully",
    };
  } catch (error) {
    logger.error("Certificate media upload error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Upload profile image
 */
export async function uploadProfileMedia(file: File) {
  try {
    logger.info("Uploading profile image");

    const formData = new FormData();
    formData.append("file", file);

    const { authenticatedFetch } = await import("./api-client");

    const response = await authenticatedFetch(MEDIA_ENDPOINTS.PROFILE_IMAGE, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || "Profile image upload failed",
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
      message: "Profile image uploaded successfully",
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
 * Upload cover image
 */
export async function uploadCoverMedia(file: File) {
  try {
    logger.info("Uploading cover image");

    const formData = new FormData();
    formData.append("file", file);

    const { authenticatedFetch } = await import("./api-client");

    const response = await authenticatedFetch(MEDIA_ENDPOINTS.PROFILE_COVER, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || "Cover image upload failed",
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
      message: "Cover image uploaded successfully",
    };
  } catch (error) {
    logger.error("Cover image upload error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Get media by ID
 */
export async function getMedia(imageId: string) {
  logger.info("Fetching media", { imageId });
  return authenticatedGet(MEDIA_ENDPOINTS.BY_ID(imageId));
}

/**
 * Get media URL from imageId
 * Handles data URIs, absolute URLs, and backend media IDs
 * Routes through proxy to include authentication headers
 */
export function getMediaUrl(imageId: string): string {
  // If imageId is already a full URL or data URI, return it directly
  if (
    imageId &&
    (imageId.startsWith("http://") ||
      imageId.startsWith("https://") ||
      imageId.startsWith("data:"))
  ) {
    return imageId;
  }

  // Route through proxy to include authentication headers
  // Media endpoints require authentication
  return `/api/proxy${MEDIA_ENDPOINTS.BY_ID(imageId)}`;
}

/**
 * Update profile with uploaded image
 * Call this after uploadProfileMedia to actually set the image on profile
 */
export async function updateProfileImage(mediaId: string) {
  try {
    logger.info("Linking profile image", { mediaId });

    const { authenticatedFetch } = await import("./api-client");

    const response = await authenticatedFetch(
      MEDIA_ENDPOINTS.PROFILE_IMAGE_WITH_MEDIA_ID(mediaId),
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || "Failed to update profile image",
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
      message: "Profile image updated successfully",
    };
  } catch (error) {
    logger.error("Profile image updating error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Update failed",
    };
  }
}

/**
 * Update profile with uploaded cover image
 * Call this after uploadCoverMedia to actually set the cover on profile
 */
export async function updateProfileCover(mediaId: string) {
  try {
    logger.info("Updating profile cover", { mediaId });

    const { authenticatedFetch } = await import("./api-client");

    const response = await authenticatedFetch(
      MEDIA_ENDPOINTS.PROFILE_COVER_WITH_MEDIA_ID(mediaId),
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || "Failed to update profile cover",
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
      message: "Profile cover updated successfully",
    };
  } catch (error) {
    logger.error("Profile cover updating error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Update failed",
    };
  }
}
