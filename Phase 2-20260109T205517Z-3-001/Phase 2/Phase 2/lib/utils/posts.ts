import { Post } from "@/lib/api/posts";

// Re-export Post type from API for consistency
export type { Post } from "@/lib/api/posts";

/**
 * Get latest posts (limited number)
 */
export function getLatestPosts(posts: Post[], limit: number = 5): Post[] {
  return [...posts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

/**
 * Get posts by organization
 */
export function getPostsByOrganization(
  posts: Post[],
  organizationId: string
): Post[] {
  return posts.filter((post) => post.organizationId === organizationId);
}

/**
 * Format post date for display
 */
export function formatPostDate(post: Post): string {
  const date = new Date(post.createdAt);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get post excerpt (shortened body text)
 */
export function getPostExcerpt(post: Post, maxLength: number = 150): string {
  const text = post.body || "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}
