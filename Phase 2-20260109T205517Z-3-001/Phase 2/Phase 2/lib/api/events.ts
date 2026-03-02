import {
  authenticatedGet,
  authenticatedPost,
  authenticatedPut,
  authenticatedDelete,
} from "./api-client";
import { logger } from "@/lib/logger";
import { EVENT_ENDPOINTS } from "./endpoints";

// Event types
export interface EventRequest {
  title: string;
  body?: string;
  industry?: number;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  startAt: string; // ISO 8601 date-time format
  endAt?: string; // ISO 8601 date-time format
  online?: boolean;
  onlineLink?: string;
  mediaIds?: string[]; // UUID array for event media (Swagger line 2048-2052)
}

export interface UpdateEventRequest {
  title?: string;
  body?: string;
  industry?: number;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  startAt?: string;
  endAt?: string;
  online?: boolean;
  onlineLink?: string;
  deletedMediaIds?: string[]; // Swagger line 1952-1955
  newMediaIds?: string[]; // Swagger line 1957-1960
}

export interface Event {
  id: string;
  title: string;
  body?: string;
  industry?: number;
  industryName?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  startAt: string;
  endAt?: string;
  online: boolean;
  onlineLink?: string;
  createdAt: string;
  updatedAt?: string;
  organizationId: string;
  organizationName?: string;
  registrationsCount?: number;
  isRegistered?: boolean;
  // Add more fields based on API response
}

export interface EventListResponse {
  items: Event[];
  totalItems: number;
  totalPages: number;
  page: number;
  size: number;
}

/**
 * Create a new event
 */
export async function createEvent(data: EventRequest) {
  logger.info("Creating event", { title: data.title });
  return authenticatedPost<Event>(EVENT_ENDPOINTS.BASE, data);
}

/**
 * Get a specific event by ID
 */
export async function getEvent(eventId: string) {
  logger.info("Fetching event", { eventId });
  return authenticatedGet<Event>(EVENT_ENDPOINTS.BY_ID(eventId));
}

/**
 * Get my events
 */
export async function getMyEvents() {
  logger.info("Fetching my events");
  const result = await authenticatedGet<{
    items: Event[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  }>(EVENT_ENDPOINTS.MY_LIST);

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
    data?: EventListResponse;
    message?: string;
    status?: number;
  };
}

/**
 * Get recommended events
 */
export async function getRecommendedEvents() {
  logger.info("Fetching recommended events");
  return authenticatedGet<EventListResponse>(EVENT_ENDPOINTS.RECOMMENDED);
}

/**
 * Get my event registrations
 */
export async function getMyEventRegistrations() {
  logger.info("Fetching my event registrations");
  return authenticatedGet<EventListResponse>(EVENT_ENDPOINTS.MY_REGISTRATIONS);
}

/**
 * Update an event
 */
export async function updateEvent(eventId: string, data: UpdateEventRequest) {
  logger.info("Updating event", { eventId });
  return authenticatedPut<Event>(EVENT_ENDPOINTS.BY_ID(eventId), data);
}

/**
 * Delete an event
 */
export async function deleteEvent(eventId: string) {
  logger.info("Deleting event", { eventId });
  return authenticatedDelete(EVENT_ENDPOINTS.BY_ID(eventId));
}

/**
 * Register for an event
 */
export async function registerForEvent(eventId: string) {
  logger.info("Registering for event", { eventId });
  return authenticatedPost(EVENT_ENDPOINTS.REGISTER(eventId), {});
}

/**
 * Unregister from an event
 */
export async function unregisterFromEvent(eventId: string) {
  logger.info("Unregistering from event", { eventId });
  return authenticatedDelete(EVENT_ENDPOINTS.REGISTER(eventId));
}
