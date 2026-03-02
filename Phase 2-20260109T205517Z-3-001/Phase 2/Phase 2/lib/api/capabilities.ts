import {
  authenticatedGet,
  authenticatedPost,
  authenticatedPut,
  authenticatedDelete,
} from "./api-client";
import { logger } from "@/lib/logger";
import { CAPABILITY_ENDPOINTS } from "./endpoints";

// Capability types
export interface CapabilityRequest {
  title: string;
  body: string;
  hashtags: number[];
}

export interface UpdateCapabilityRequest {
  name?: string; // Note: Swagger uses 'name' not 'title' for updates
  body?: string;
  deletedHashtagIds?: number[];
  newHashtagIds?: number[];
}

export interface Capability {
  id: string;
  title: string;
  body: string;
  hashtags: number[];
  createdAt: string;
  updatedAt?: string;
  organizationId: string;
  organizationName?: string;
  // Add more fields based on API response
}

export interface CapabilityListResponse {
  items: Capability[];
  totalItems: number;
  totalPages: number;
  page: number;
  size: number;
}

/**
 * Create a new capability
 */
export async function createCapability(data: CapabilityRequest) {
  logger.info("Creating capability", { title: data.title });
  return authenticatedPost<Capability>(CAPABILITY_ENDPOINTS.BASE, data);
}

/**
 * Get list of all capabilities (public)
 * @param orgId - Optional organization ID to filter capabilities
 */
export async function getCapabilities(orgId?: string) {
  logger.info("Fetching all capabilities", { orgId });
  const endpoint = orgId
    ? `${CAPABILITY_ENDPOINTS.LIST}?orgId=${orgId}`
    : CAPABILITY_ENDPOINTS.LIST;
  return authenticatedGet<CapabilityListResponse>(endpoint);
}

/**
 * Get my capabilities
 */
export async function getMyCapabilities() {
  logger.info("Fetching my capabilities");
  const result = await authenticatedGet<{
    items: Capability[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  }>(CAPABILITY_ENDPOINTS.MY_LIST);

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
    data?: CapabilityListResponse;
    message?: string;
    status?: number;
  };
}

/**
 * Update a capability
 */
export async function updateCapability(
  capabilityId: string,
  data: UpdateCapabilityRequest
) {
  logger.info("Updating capability", { capabilityId });
  return authenticatedPut<Capability>(
    CAPABILITY_ENDPOINTS.BY_ID(capabilityId),
    data
  );
}

/**
 * Delete a capability
 */
export async function deleteCapability(capabilityId: string) {
  logger.info("Deleting capability", { capabilityId });
  return authenticatedDelete(CAPABILITY_ENDPOINTS.BY_ID(capabilityId));
}
