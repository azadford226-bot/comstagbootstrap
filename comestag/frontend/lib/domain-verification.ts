import { authenticatedGet, authenticatedPost } from "@/lib/api/api-client";

export type DomainVerificationStatus = {
  domain: string;
  verified: boolean;
  verifiedAt: string | null;
  token: string;
  method: string;
};

export async function initiateDomainVerification(domain: string) {
  return authenticatedPost<{
    domain: string;
    token: string;
    method: string;
    instruction: string;
    verified?: boolean;
  }>("/v1/verification/domain/initiate", { domain });
}

export async function checkDomainVerification(domain: string) {
  return authenticatedPost<{
    verified: boolean;
    domain: string;
    message?: string;
  }>("/v1/verification/domain/check", { domain });
}

export async function listDomainVerifications() {
  return authenticatedGet<DomainVerificationStatus[]>("/v1/verification/domain/status");
}
