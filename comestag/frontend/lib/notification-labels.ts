/**
 * In-app notification type labels — keep in sync with backend event names where applicable.
 * Java enum `NotificationType` includes both legacy (POST_REACTED) and wire-friendly aliases.
 */
export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  // RFQ / procurement
  RFQ_NEW: "New RFQ posted",
  RFQ_BID: "New bid on your RFQ",
  RFQ_AWARDED: "RFQ awarded",
  RFQ_CLOSED: "RFQ closed",
  // Messaging
  MESSAGE_NEW: "New message",
  // Social
  POST_LIKE: "Liked your post",
  POST_COMMENT: "Commented on your post",
  POST_REACTED: "Reaction on your post",
  POST_COMMENTED: "Comment on your post",
  COMMENT_REPLIED: "Reply to your comment",
  FOLLOW: "Started following your company",
  // Opportunities
  OPPORTUNITY_NEW: "New opportunity posted",
  OPPORTUNITY_INTEREST: "Interest in your opportunity",
  // System / org
  SYSTEM: "System notification",
  TESTIMONIAL_ADDED: "New testimonial",
  EVENT_REGISTERED: "Event registration",
  EVENT_REGISTRATION_CANCELLED: "Event registration cancelled",
  ORG_APPROVAL_CHANGED: "Organization approval updated",
  EVENT_REMINDER: "Event reminder",
};

export function notificationLabel(type: string): string {
  return NOTIFICATION_TYPE_LABELS[type] ?? type.replace(/_/g, " ");
}

export function notificationCategory(
  type: string
): "rfq" | "message" | "social" | "system" | "opportunity" {
  if (type.startsWith("RFQ")) return "rfq";
  if (type.startsWith("MESSAGE")) return "message";
  if (type.startsWith("OPPORTUNITY")) return "opportunity";
  if (
    type.startsWith("POST") ||
    type === "FOLLOW" ||
    type === "COMMENT_REPLIED" ||
    type === "TESTIMONIAL_ADDED"
  )
    return "social";
  return "system";
}
