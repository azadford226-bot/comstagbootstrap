/**
 * API Endpoints Configuration
 *
 * Centralized endpoint definitions for the ComStag Platform API.
 * All API functions should import endpoints from this file to ensure consistency
 * and make endpoint management easier.
 */

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/v1/auth/login",
  LOGOUT: "/v1/auth/logout",
  REFRESH_TOKEN: "/v1/auth/refresh-token",
  VERIFY_CODE: "/v1/auth/token",
  EMAIL_VERIFY: "/v1/auth/email-verify",
  REQUEST_CODE: "/v1/auth/request-code",
  RESET_PASSWORD: "/v1/auth/reset-pass",
  REGISTER_ORGANIZATION: "/v1/auth/register/org",
  REGISTER_CONSUMER: "/v1/auth/register/cons",
} as const;

// Profile endpoints
export const PROFILE_ENDPOINTS = {
  BASE: "/v1/profile",
  ORGANIZATION: "/v1/profile/org",
  CONSUMER: "/v1/profile/cons",
  EMAIL: "/v1/profile/email",
  RESET_PASSWORD: "/v1/profile/reset-pass",
  IMAGE: "/v1/profile/image",
  COVER: "/v1/profile/cover",
} as const;

// Capability endpoints
export const CAPABILITY_ENDPOINTS = {
  BASE: "/v1/capability",
  LIST: "/v1/capability/list",
  MY_LIST: "/v1/capability/my-list",
  BY_ID: (id: string) => `/v1/capability/${id}`,
} as const;

// Certificate endpoints
export const CERTIFICATE_ENDPOINTS = {
  BASE: "/v1/certificate",
  LIST: "/v1/certificate/list",
  MY_LIST: "/v1/certificate/my-list",
  BY_ID: (id: string) => `/v1/certificate/${id}`,
} as const;

// Success story endpoints
export const SUCCESS_STORY_ENDPOINTS = {
  BASE: "/v1/success-story",
  LIST: "/v1/success-story/list",
  MY_LIST: "/v1/success-story/my-list",
  BY_ID: (id: string) => `/v1/success-story/${id}`,
} as const;

// Testimonial endpoints
export const TESTIMONIAL_ENDPOINTS = {
  BASE: "/v1/testimonial",
  LIST: "/v1/testimonial/list",
  MY_LIST: "/v1/testimonial/my-list",
  LIST_WITH_ORG: (orgId: string) => `/v1/testimonial/list?orgId=${orgId}`,
  LIST_MINE_SORT: "/v1/testimonial/list?sortType=MINE",
  BY_ID: (id: string) => `/v1/testimonial/${id}`,
} as const;

// Event endpoints
export const EVENT_ENDPOINTS = {
  BASE: "/v1/event",
  MY_LIST: "/v1/event/my-list",
  RECOMMENDED: "/v1/event/recommended",
  MY_REGISTRATIONS: "/v1/event/my-registrations",
  BY_ID: (id: string) => `/v1/event/${id}`,
  REGISTER: (id: string) => `/v1/event/${id}/register`,
  // Note: Unregister uses the same path as register but with DELETE method
} as const;

// Post endpoints
export const POST_ENDPOINTS = {
  BASE: "/v1/post",
  LIST: "/v1/post/list",
  MY_LIST: "/v1/post/my-list",
  BY_ID: (id: string) => `/v1/post/${id}`,
} as const;

// Media endpoints
export const MEDIA_ENDPOINTS = {
  SUCCESS_STORY: "/v1/media/success-story",
  CERTIFICATE: "/v1/media/certificate",
  POST: "/v1/media/post",
  PROFILE_IMAGE: "/v1/media/profile/image",
  PROFILE_COVER: "/v1/media/profile/cover",
  BY_ID: (id: string) => `/v1/media/${id}`,
  PROFILE_IMAGE_WITH_MEDIA_ID: (mediaId: string) =>
    `/v1/profile/image?mediaId=${mediaId}`,
  PROFILE_COVER_WITH_MEDIA_ID: (mediaId: string) =>
    `/v1/profile/cover?mediaId=${mediaId}`,
} as const;

// Contact endpoints
export const CONTACT_ENDPOINTS = {
  SUBMIT: "/v1/contact",
} as const;

// Utility function to build query parameters
export const buildQueryParams = (
  params: Record<string, string | number | boolean | undefined>
): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

// Export all endpoints as a single object for convenience
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  PROFILE: PROFILE_ENDPOINTS,
  CAPABILITY: CAPABILITY_ENDPOINTS,
  CERTIFICATE: CERTIFICATE_ENDPOINTS,
  SUCCESS_STORY: SUCCESS_STORY_ENDPOINTS,
  TESTIMONIAL: TESTIMONIAL_ENDPOINTS,
  EVENT: EVENT_ENDPOINTS,
  POST: POST_ENDPOINTS,
  MEDIA: MEDIA_ENDPOINTS,
} as const;

export default API_ENDPOINTS;
