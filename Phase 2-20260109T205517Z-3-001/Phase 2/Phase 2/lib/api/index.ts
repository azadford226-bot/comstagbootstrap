/**
 * ComStag API Client
 *
 * Centralized exports for all API modules with automatic token refresh
 */

// Auth
export * from "./auth";

// Profile
export * from "./profile";

// Capabilities
export * from "./capabilities";

// Events
export * from "./events";

// Content (Success Stories, Testimonials, Certificates)
export * from "./content";

// Media
export * from "./media";

// Endpoints
export * from "./endpoints";

// API Client utilities
export {
  authenticatedFetch,
  authenticatedGet,
  authenticatedPost,
  authenticatedPut,
  authenticatedDelete,
} from "./api-client";
