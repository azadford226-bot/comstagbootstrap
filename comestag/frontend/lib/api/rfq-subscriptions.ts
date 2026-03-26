import {
  authenticatedGet,
  authenticatedPost,
  authenticatedDelete,
} from "./api-client";

export interface RfqSubscription {
  id: string;
  keyword: string | null;
  category: string | null;
  createdAt: string;
}

export function listRfqSubscriptions() {
  return authenticatedGet<RfqSubscription[]>("/v1/rfq/subscriptions");
}

export function createRfqSubscription(data: {
  keyword?: string | null;
  category?: string | null;
}) {
  return authenticatedPost<RfqSubscription>("/v1/rfq/subscriptions", data);
}

export function deleteRfqSubscription(id: string) {
  return authenticatedDelete(`/v1/rfq/subscriptions/${id}`);
}
