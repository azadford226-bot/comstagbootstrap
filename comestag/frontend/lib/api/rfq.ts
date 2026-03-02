import { authenticatedGet, authenticatedPost } from "./api-client";

export interface Rfq {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  category: string | null;
  industryId: number | null;
  budget: number | null;
  budgetCurrency: string;
  deadline: string | null;
  requirements: string | null;
  status: string;
  visibility: string;
  awardedToId: string | null;
  createdAt: string;
  updatedAt: string;
  proposalCount: number;
  hasSubmitted: boolean;
  isOwner: boolean;
}

export interface CreateRfqRequest {
  title: string;
  description: string;
  category?: string;
  industryId?: number;
  budget?: number;
  budgetCurrency?: string;
  deadline?: string;
  requirements?: string;
  visibility: string;
  invitedOrganizationIds?: string[];
  mediaIds?: string[];
}

export interface SubmitProposalRequest {
  rfqId: string;
  proposalText: string;
  price: number;
  currency?: string;
  deliveryTime?: string;
}

export interface AwardRfqRequest {
  rfqId: string;
  awardedToOrganizationId: string;
}

export interface RfqListResponse {
  content: Rfq[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * List RFQs with filters
 */
export async function listRfqs(params: {
  filter?: "all" | "mine" | "available";
  status?: string;
  industryId?: number;
  page?: number;
  size?: number;
}): Promise<{ success: boolean; data?: RfqListResponse; message?: string }> {
  const queryParams = new URLSearchParams();
  if (params.filter) queryParams.append("filter", params.filter);
  if (params.status) queryParams.append("status", params.status);
  if (params.industryId) queryParams.append("industryId", params.industryId.toString());
  if (params.page !== undefined) queryParams.append("page", params.page.toString());
  if (params.size !== undefined) queryParams.append("size", params.size.toString());

  const response = await authenticatedGet<RfqListResponse>(`/v1/rfq?${queryParams}`);
  return response;
}

/**
 * Get a single RFQ by ID
 */
export async function getRfq(id: string): Promise<{ success: boolean; data?: Rfq; message?: string }> {
  const response = await authenticatedGet<Rfq>(`/v1/rfq/${id}`);
  return response;
}

/**
 * Create a new RFQ
 */
export async function createRfq(
  data: CreateRfqRequest
): Promise<{ success: boolean; message?: string }> {
  const response = await authenticatedPost("/v1/rfq", data);
  return {
    success: response.success,
    message: response.message,
  };
}

/**
 * Submit a proposal for an RFQ
 */
export async function submitProposal(
  data: SubmitProposalRequest
): Promise<{ success: boolean; message?: string }> {
  const response = await authenticatedPost("/v1/rfq/proposal", data);
  return {
    success: response.success,
    message: response.message,
  };
}

/**
 * Award an RFQ to an organization
 */
export async function awardRfq(
  data: AwardRfqRequest
): Promise<{ success: boolean; message?: string }> {
  const response = await authenticatedPost("/v1/rfq/award", data);
  return {
    success: response.success,
    message: response.message,
  };
}


