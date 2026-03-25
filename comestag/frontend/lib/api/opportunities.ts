import { authenticatedGet, authenticatedPost, authenticatedDelete } from "./api-client";

export interface Opportunity {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  type: string;
  status: string;
  company: string | null;
  location: string | null;
  equity: string | null;
  funding: string | null;
  stage: string | null;
  deadline: string | null;
  tags: string[] | null;
  cohortDetails: string | null;
  milestones: string | null;
  duration: string | null;
  interestCount: number;
  hasExpressedInterest: boolean;
  createdAt: string;
}

export interface OpportunityListResponse {
  content: Opportunity[];
  totalElements: number;
  totalPages: number;
}

export interface CreateOpportunityRequest {
  title: string;
  description: string;
  type: string;
  company?: string;
  location?: string;
  equity?: string;
  funding?: string;
  stage?: string;
  deadline?: string;
  tags?: string[];
  cohortDetails?: string;
  milestones?: string;
  duration?: string;
}

export async function listOpportunities(type = "all", page = 0, size = 20) {
  return authenticatedGet<OpportunityListResponse>(`/v1/opportunities?type=${type}&page=${page}&size=${size}`);
}

export async function getOpportunity(id: string) {
  return authenticatedGet<Opportunity>(`/v1/opportunities/${id}`);
}

export async function createOpportunity(request: CreateOpportunityRequest) {
  return authenticatedPost<Opportunity>("/v1/opportunities", request);
}

export async function expressInterest(id: string) {
  return authenticatedPost<void>(`/v1/opportunities/${id}/interest`, {});
}

export async function withdrawInterest(id: string) {
  return authenticatedDelete<void>(`/v1/opportunities/${id}/interest`);
}
