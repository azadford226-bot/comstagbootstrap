import {
  authenticatedGet,
  authenticatedPost,
  authenticatedPut,
  authenticatedDelete,
} from "./api-client";
import { logger } from "@/lib/logger";
import {
  SUCCESS_STORY_ENDPOINTS,
  TESTIMONIAL_ENDPOINTS,
  CERTIFICATE_ENDPOINTS,
} from "./endpoints";

// Success Story types
export interface SuccessStoryRequest {
  title: string;
  body: string;
  mediaIds?: string[]; // UUID array, max 20
  hashtags: number[]; // min 1, max 10
}

export interface UpdateSuccessStoryRequest {
  title?: string;
  body?: string;
  deletedMediaIds?: string[];
  newMediaIds?: string[];
  deletedHashtagIds?: number[];
  newHashtagIds?: number[];
}

export interface SuccessStory {
  id: string;
  title: string;
  body: string;
  mediaIds?: string[];
  hashtags: number[];
  createdAt: string;
  updatedAt?: string;
  organizationId: string;
  organizationName?: string;
  // Add more fields based on API response
}

export interface SuccessStoryListResponse {
  items: SuccessStory[];
  totalItems: number;
  totalPages: number;
  page: number;
  size: number;
}

// Testimonial types
export interface CreateTestimonialRequest {
  orgId: string; // UUID of organization
  rating: number; // 1-5
  comment?: string;
  verificationCode: string;
}

export interface UpdateTestimonialRequest {
  testimonialId: string;
  rating: number;
  comment?: string;
  code: string;
}

export interface Testimonial {
  id: string;
  organizationId: string;
  organizationName?: string;
  consumerId: string;
  consumerName?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
  // Add more fields based on API response
}

export interface TestimonialListResponse {
  items: Testimonial[];
  totalItems: number;
  totalPages: number;
  page: number;
  size: number;
}

// Certificate types
export interface CertificateRequest {
  imageId: string; // UUID
  title: string;
  body?: string;
  link?: string;
  certificateDate: string; // ISO 8601 date format
}

export interface UpdateCertificateRequest {
  newImageId?: string; // Swagger uses 'newImageId' not 'imageId' (line 1971)
  title?: string;
  body?: string;
  link?: string;
  certificateDate?: string;
}

export interface Certificate {
  id: string;
  image: {
    id: string;
    mediaType: string;
  };
  imageId?: string; // Deprecated: use image.id instead, kept for backwards compatibility
  title: string;
  body?: string;
  link?: string;
  certificateDate: string;
  createdAt: string;
  updatedAt?: string;
  organizationId: string;
  verified?: boolean;
  // Add more fields based on API response
}

export interface CertificateListResponse {
  items: Certificate[];
  totalItems: number;
  totalPages: number;
  page: number;
  size: number;
}

// ========== Success Stories ==========

/**
 * Create a new success story
 */
export async function createSuccessStory(data: SuccessStoryRequest) {
  logger.info("Creating success story", { title: data.title });
  return authenticatedPost<SuccessStory>(SUCCESS_STORY_ENDPOINTS.BASE, data);
}

/**
 * Get all success stories (public list)
 * @param orgId - Optional organization ID to filter success stories
 */
export async function getSuccessStories(orgId?: string) {
  logger.info("Fetching all success stories", { orgId });
  const endpoint = orgId
    ? `${SUCCESS_STORY_ENDPOINTS.LIST}?orgId=${orgId}`
    : SUCCESS_STORY_ENDPOINTS.LIST;
  return authenticatedGet<SuccessStoryListResponse>(endpoint);
}

/**
 * Get my success stories
 */
export async function getMySuccessStories() {
  logger.info("Fetching my success stories");
  const result = await authenticatedGet<{
    items: SuccessStory[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  }>(SUCCESS_STORY_ENDPOINTS.MY_LIST);

  // API returns paginated data with items array, convert to expected format
  if (result.success && result.data && "items" in result.data) {
    return {
      ...result,
      data: {
        items: result.data.items,
        totalItems: result.data.totalItems,
        totalPages: result.data.totalPages,
        page: result.data.page,
        size: result.data.size,
      },
    };
  }

  return result as {
    success: boolean;
    data?: SuccessStoryListResponse;
    message?: string;
    status?: number;
  };
}

/**
 * Update a success story
 */
export async function updateSuccessStory(
  successStoryId: string,
  data: UpdateSuccessStoryRequest
) {
  logger.info("Updating success story", { successStoryId });
  return authenticatedPut<SuccessStory>(
    SUCCESS_STORY_ENDPOINTS.BY_ID(successStoryId),
    data
  );
}

/**
 * Delete a success story
 */
export async function deleteSuccessStory(successStoryId: string) {
  logger.info("Deleting success story", { successStoryId });
  return authenticatedDelete(SUCCESS_STORY_ENDPOINTS.BY_ID(successStoryId));
}

// ========== Testimonials ==========

/**
 * Create a new testimonial
 * Note: Only consumers can create testimonials
 */
export async function createTestimonial(data: CreateTestimonialRequest) {
  logger.info("Creating testimonial", {
    orgId: data.orgId,
    rating: data.rating,
  });
  return authenticatedPost<Testimonial>(TESTIMONIAL_ENDPOINTS.BASE, data);
}

/**
 * Get testimonials for a specific organization
 * @param orgId - Organization ID to get testimonials for
 */
export async function getTestimonials(orgId?: string) {
  if (orgId) {
    logger.info("Fetching testimonials for organization", { orgId });
    return authenticatedGet<TestimonialListResponse>(
      TESTIMONIAL_ENDPOINTS.LIST_WITH_ORG(orgId)
    );
  }
  logger.info("Fetching all testimonials (no orgId specified)");
  return authenticatedGet<TestimonialListResponse>(TESTIMONIAL_ENDPOINTS.LIST);
}

/**
 * Get testimonials about MY organization
 * These are testimonials that others wrote about my organization
 */
export async function getTestimonialsAboutMe() {
  logger.info("Fetching testimonials about my organization");
  return authenticatedGet<TestimonialListResponse>(
    TESTIMONIAL_ENDPOINTS.MY_LIST
  );
}

/**
 * Get testimonials I wrote about other organizations
 * Use sortType=MINE to get testimonials authored by current user
 */
export async function getTestimonialsIWrote() {
  logger.info("Fetching testimonials I wrote about other organizations");
  return authenticatedGet<TestimonialListResponse>(
    TESTIMONIAL_ENDPOINTS.LIST_MINE_SORT
  );
}

/**
 * @deprecated Use getTestimonialsAboutMe() instead for clarity
 */
export async function getMyTestimonials() {
  logger.info(
    "Fetching my testimonials (deprecated - use getTestimonialsAboutMe)"
  );
  return getTestimonialsAboutMe();
}

/**
 * Update a testimonial
 */
export async function updateTestimonial(data: UpdateTestimonialRequest) {
  logger.info("Updating testimonial", { testimonialId: data.testimonialId });
  return authenticatedPut<Testimonial>(TESTIMONIAL_ENDPOINTS.BASE, data);
}

/**
 * Delete a testimonial
 */
export async function deleteTestimonial(testimonialId: string) {
  logger.info("Deleting testimonial", { testimonialId });
  return authenticatedDelete(TESTIMONIAL_ENDPOINTS.BY_ID(testimonialId));
}

// ========== Certificates ==========

/**
 * Create a new certificate
 */
export async function createCertificate(data: CertificateRequest) {
  logger.info("Creating certificate", { title: data.title });
  return authenticatedPost<Certificate>(CERTIFICATE_ENDPOINTS.BASE, data);
}

/**
 * Get all certificates (public list)
 * @param orgId - Optional organization ID to filter certificates
 */
export async function getCertificates(orgId?: string) {
  logger.info("Fetching all certificates", { orgId });
  const endpoint = orgId
    ? `${CERTIFICATE_ENDPOINTS.LIST}?orgId=${orgId}`
    : CERTIFICATE_ENDPOINTS.LIST;
  return authenticatedGet<CertificateListResponse>(endpoint);
}

/**
 * Get my certificates
 */
export async function getMyCertificates() {
  logger.info("Fetching my certificates");
  const result = await authenticatedGet<{
    items: Certificate[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  }>(CERTIFICATE_ENDPOINTS.MY_LIST);

  // API returns paginated data with items array, convert to expected format
  if (result.success && result.data && "items" in result.data) {
    return {
      ...result,
      data: {
        items: result.data.items,
        totalItems: result.data.totalItems,
        totalPages: result.data.totalPages,
        page: result.data.page,
        size: result.data.size,
      },
    };
  }

  return result as {
    success: boolean;
    data?: CertificateListResponse;
    message?: string;
    status?: number;
  };
}

/**
 * Update a certificate
 */
export async function updateCertificate(
  certificateId: string,
  data: UpdateCertificateRequest
) {
  logger.info("Updating certificate", { certificateId });
  return authenticatedPut<Certificate>(
    CERTIFICATE_ENDPOINTS.BY_ID(certificateId),
    data
  );
}

/**
 * Delete a certificate
 */
export async function deleteCertificate(certificateId: string) {
  logger.info("Deleting certificate", { certificateId });
  return authenticatedDelete(CERTIFICATE_ENDPOINTS.BY_ID(certificateId));
}
