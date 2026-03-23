import {
  authenticatedGet,
  authenticatedPost,
  authenticatedPut,
  authenticatedDelete,
} from "./api-client";
import { POST_ENDPOINTS } from "./endpoints";
import { logger } from "@/lib/logger";

// Post types
export interface PostRequest {
  // Note: Swagger spec (line 2022-2032) shows NO title field for posts
  // Posts only have body (required) and mediaIds (optional)
  body: string;
  mediaIds?: string[]; // UUID array for post media
  hashtags?: number[]; // hashtag IDs (not in Swagger but keeping for frontend use)
}

export interface UpdatePostRequest {
  // Note: No title field in Swagger UpdatePostRequest (line 1922-1936)
  body?: string;
  deletedMediaIds?: string[];
  newMediaIds?: string[];
  deletedHashtagIds?: number[];
  newHashtagIds?: number[];
}

export interface Post {
  id: string;
  body: string;
  mediaIds?: string[];
  hashtags?: number[];
  reactionsCount?: number;
  commentsCount?: number;
  views?: number;
  createdAt: string;
  updatedAt?: string;
  organizationId: string;
  organizationName?: string;
}

export interface PostListResponse {
  items: Post[];
  totalItems: number;
  totalPages: number;
  page: number;
  size: number;
}

/**
 * Create a new post
 */
export async function createPost(data: PostRequest) {
  logger.info("Creating post", { bodyLength: data.body?.length });
  return authenticatedPost<Post>(POST_ENDPOINTS.BASE, data);
}

/**
 * Get a specific post by ID
 */
export async function getPost(postId: string) {
  logger.info("Fetching post", { postId });
  return authenticatedGet<Post>(POST_ENDPOINTS.BY_ID(postId));
}

/**
 * Get all posts (public)
 * @param orgId - Optional organization ID to filter posts
 */
export async function getPosts(orgId?: string) {
  logger.info("Fetching all posts", { orgId });
  const endpoint = orgId
    ? `${POST_ENDPOINTS.LIST}?orgId=${orgId}`
    : POST_ENDPOINTS.LIST;
  return authenticatedGet<PostListResponse>(endpoint);
}

/**
 * Get my posts
 */
export async function getMyPosts() {
  logger.info("Fetching my posts");
  const result = await authenticatedGet<{
    items: Post[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  }>(POST_ENDPOINTS.MY_LIST);

  // API returns paginated data with items array, convert to expected format
  if (result.success && result.data && "items" in result.data) {
    return {
      ...result,
      data: {
        items: result.data.items,
        totalItems: result.data.totalItems,
        totalPages: result.data.totalPages,
        page: result.data.page,
        size: result.data.size,
      },
    };
  }

  return result as {
    success: boolean;
    data?: PostListResponse;
    message?: string;
    status?: number;
  };
}

/**
 * Update a post
 */
export async function updatePost(postId: string, data: UpdatePostRequest) {
  logger.info("Updating post", { postId });
  return authenticatedPut<Post>(POST_ENDPOINTS.BY_ID(postId), data);
}

/**
 * Delete a post
 */
export async function deletePost(postId: string) {
  logger.info("Deleting post", { postId });
  return authenticatedDelete(POST_ENDPOINTS.BY_ID(postId));
}

/**
 * React to a post (like, celebrate, etc.)
 */
export async function reactToPost(
  postId: string,
  reaction: "LIKE" | "CELEBRATE" | "SUPPORT" | "LOVE" | "INSIGHTFUL" | "CURIOUS"
) {
  logger.info("Reacting to post", { postId, reaction });
  return authenticatedPost(`/v1/post/${postId}/react`, { reaction });
}

/**
 * Remove reaction from a post
 */
export async function removeReaction(postId: string) {
  logger.info("Removing reaction from post", { postId });
  return authenticatedDelete(`/v1/post/${postId}/react`);
}

export interface PostComment {
  id: string;
  postId: string;
  accountId: string;
  body: string;
  parentCommentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommentListResponse {
  items: PostComment[];
  totalItems: number;
  totalPages: number;
  page: number;
  size: number;
}

/**
 * List comments for a post
 */
export async function getPostComments(postId: string, page = 0, size = 20) {
  return authenticatedGet<CommentListResponse>(
    `/v1/post/${postId}/comments?page=${page}&size=${size}`
  );
}

/**
 * Add a comment to a post
 */
export async function addComment(
  postId: string,
  body: string,
  parentCommentId?: string
) {
  return authenticatedPost(`/v1/post/${postId}/comment`, {
    body,
    parentCommentId: parentCommentId || null,
  });
}
