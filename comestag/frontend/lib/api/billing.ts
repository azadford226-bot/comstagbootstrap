import { authenticatedGet, authenticatedPost } from "./api-client";

export interface SubscriptionStatus {
  status: string;
  trialEndsAt?: string;
  currentPeriodEndsAt?: string;
  cancelAtPeriodEnd?: boolean;
  configured: boolean;
}

export function getSubscription() {
  return authenticatedGet<SubscriptionStatus>("/v1/billing/subscription");
}

export function createCheckout() {
  return authenticatedPost<{ checkoutUrl: string }>("/v1/billing/checkout");
}

export function createCustomerPortal() {
  return authenticatedPost<{ portalUrl: string }>("/v1/billing/portal");
}