import {
  authenticatedPost,
  authenticatedDelete,
  authenticatedGet,
} from "./api-client";

export async function followUser(targetId: string) {
  return authenticatedPost(`/v1/follow/${targetId}`);
}

export async function unfollowUser(targetId: string) {
  return authenticatedDelete(`/v1/follow/${targetId}`);
}

export async function getFollowStatus(targetId: string) {
  return authenticatedGet<{ following: boolean }>(
    `/v1/follow/${targetId}/status`
  );
}

export async function getFollowCounts(targetId: string) {
  return authenticatedGet<{ followers: number; following: number }>(
    `/v1/follow/${targetId}/counts`
  );
}

export async function bookmarkItem(targetType: string, targetId: string) {
  return authenticatedPost(`/v1/bookmarks/${targetType}/${targetId}`);
}

export async function unbookmarkItem(targetType: string, targetId: string) {
  return authenticatedDelete(`/v1/bookmarks/${targetType}/${targetId}`);
}

export async function getBookmarkStatus(
  targetType: string,
  targetId: string
) {
  return authenticatedGet<{ bookmarked: boolean }>(
    `/v1/bookmarks/${targetType}/${targetId}/status`
  );
}

export interface BookmarkItem {
  id: string;
  accountId: string;
  targetType: string;
  targetId: string;
  createdAt: string;
}

export async function getBookmarks(
  targetType?: string,
  page = 0,
  size = 20
) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (targetType) params.append("targetType", targetType);
  return authenticatedGet<{
    content: BookmarkItem[];
    totalElements: number;
    totalPages: number;
  }>(`/v1/bookmarks?${params}`);
}
