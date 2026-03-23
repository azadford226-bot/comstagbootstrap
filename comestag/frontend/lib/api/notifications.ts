import { NOTIFICATION_ENDPOINTS, buildQueryParams } from "./endpoints";
import {
  authenticatedGet,
  authenticatedPost,
  authenticatedPut,
} from "./api-client";

export interface NotificationView {
  notificationId: string;
  type: string;
  createdAt: string;
  actorAccountId: string;
  targetKind: string;
  targetId: string;
  payload: Record<string, unknown>;
  readAt: string | null;
}

export interface PageResult<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface NotificationSettings {
  accountId: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  preferences: Record<string, unknown>;
}

export async function getNotifications(page = 0, size = 20) {
  return authenticatedGet<PageResult<NotificationView>>(
    `${NOTIFICATION_ENDPOINTS.BASE}${buildQueryParams({ page, size })}`
  );
}

export async function getUnreadCount() {
  return authenticatedGet<number>(NOTIFICATION_ENDPOINTS.UNREAD_COUNT);
}

export async function markNotificationRead(id: string) {
  return authenticatedPost(NOTIFICATION_ENDPOINTS.MARK_READ(id));
}

export async function markAllNotificationsRead() {
  return authenticatedPost(NOTIFICATION_ENDPOINTS.MARK_ALL_READ);
}

export async function getNotificationSettings() {
  return authenticatedGet<NotificationSettings>(
    NOTIFICATION_ENDPOINTS.SETTINGS
  );
}

export async function updateNotificationSettings(
  settings: Partial<NotificationSettings>
) {
  return authenticatedPut<NotificationSettings>(
    NOTIFICATION_ENDPOINTS.SETTINGS,
    settings
  );
}
