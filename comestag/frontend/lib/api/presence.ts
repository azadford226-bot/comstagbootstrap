import { authenticatedPost } from "./api-client";

/** Keep session warm for online indicators (best-effort). */
export async function sendPresenceHeartbeat(): Promise<void> {
  await authenticatedPost("/v1/presence/heartbeat", {}).catch(() => {});
}

export async function sendTypingIndicator(conversationId: string, typing: boolean): Promise<void> {
  await authenticatedPost("/v1/presence/typing", {
    conversationId,
    typing,
  }).catch(() => {});
}
