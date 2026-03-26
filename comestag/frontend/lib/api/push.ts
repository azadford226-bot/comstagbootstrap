import { authenticatedFetch, authenticatedPost } from "./api-client";

export interface PushSubscriptionPayload {
  endpoint: string;
  p256dh: string;
  auth: string;
}

/** Serialize a browser PushSubscription for POST /v1/push/subscribe */
export function pushSubscriptionToPayload(sub: PushSubscription): PushSubscriptionPayload {
  const j = sub.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  return {
    endpoint: j.endpoint ?? "",
    p256dh: j.keys?.p256dh ?? "",
    auth: j.keys?.auth ?? "",
  };
}

export async function savePushSubscriptionToServer(payload: PushSubscriptionPayload) {
  return authenticatedPost<{ status?: string }>("/v1/push/subscribe", payload);
}

export async function removePushSubscriptionFromServer(endpoint: string) {
  const response = await authenticatedFetch("/v1/push/unsubscribe", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return {
      success: false as const,
      message: (err as { message?: string }).message || `HTTP ${response.status}`,
    };
  }
  return { success: true as const, data: undefined };
}
