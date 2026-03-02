"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Edit2, Trash2, X, Save, Upload } from "lucide-react";
import { getMediaUrl } from "@/lib/api/media";
import { Post, formatPostDate, getPostExcerpt } from "@/lib/utils/posts";
import { createPost, updatePost, deletePost } from "@/lib/api/posts";
import { uploadPostMedia } from "@/lib/api/media";

interface PostsFeedProps {
  posts: Post[];
  maxPosts?: number;
  showFullContent?: boolean;
  className?: string;
  enableCRUD?: boolean; // Enable create/edit/delete operations
  onUpdate?: () => void; // Callback after CRUD operations
}

export const PostsFeed: React.FC<PostsFeedProps> = ({
  posts,
  maxPosts = 5,
  showFullContent = false,
  className = "",
  enableCRUD = false,
  onUpdate,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    body: "",
    mediaIds: [] as string[],
  });
  const [originalMediaIds, setOriginalMediaIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const displayPosts = maxPosts ? posts.slice(0, maxPosts) : posts;

  const handleAdd = () => {
    setFormData({ body: "", mediaIds: [] });
    setOriginalMediaIds([]);
    setEditingId(null);
    setIsAdding(true);
    setError("");
  };

  const handleEdit = (post: Post) => {
    const postMediaIds = post.mediaIds || [];
    setFormData({ body: post.body, mediaIds: postMediaIds });
    setOriginalMediaIds(postMediaIds);
    setEditingId(post.id);
    setIsAdding(false);
    setError("");
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ body: "", mediaIds: [] });
    setOriginalMediaIds([]);
    setError("");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formData.mediaIds.length + files.length > 20) {
      setError(
        `Maximum 20 files allowed. You can add ${
          20 - formData.mediaIds.length
        } more.`
      );
      return;
    }

    const invalidFiles = Array.from(files).filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (invalidFiles.length > 0) {
      setError("Some files exceed 10MB limit.");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const result = await uploadPostMedia(Array.from(files));
      if (result.success && result.data?.mediaIds) {
        setFormData({
          ...formData,
          mediaIds: [...formData.mediaIds, ...result.data.mediaIds],
        });
      } else {
        setError(result.message || "Failed to upload files");
      }
    } catch {
      setError("An error occurred while uploading files");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setFormData({
      ...formData,
      mediaIds: formData.mediaIds.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      let result;
      
      if (editingId) {
        // Update mode: determine deleted and new media
        const currentMediaIds = formData.mediaIds;
        const deletedMediaIds = originalMediaIds.filter(
          (id) => !currentMediaIds.includes(id)
        );
        const newMediaIds = currentMediaIds.filter(
          (id) => !originalMediaIds.includes(id)
        );

        result = await updatePost(editingId, {
          body: formData.body,
          deletedMediaIds: deletedMediaIds.length > 0 ? deletedMediaIds : undefined,
          newMediaIds: newMediaIds.length > 0 ? newMediaIds : undefined,
        });
      } else {
        // Create mode: all mediaIds are new
        result = await createPost(formData);
      }

      if (!result.success) {
        setError(result.message || "Failed to save post");
        setIsSubmitting(false);
        return;
      }

      handleCancel();
      onUpdate?.();
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setIsSubmitting(true);
    try {
      const result = await deletePost(id);
      if (result.success) {
        onUpdate?.();
      } else {
        alert(result.message || "Failed to delete post");
      }
    } catch {
      alert("An error occurred while deleting");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (displayPosts.length === 0 && !enableCRUD) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-600">No posts available</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {enableCRUD && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary-dark">Posts</h2>
            {!isAdding && !editingId && (
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Post
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {(isAdding || editingId) && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 p-4 border-2 border-primary rounded-lg bg-blue-50"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.body}
                    onChange={(e) =>
                      setFormData({ ...formData, body: e.target.value })
                    }
                    required
                    rows={4}
                    maxLength={2000}
                    className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none resize-none"
                    placeholder="Share an update, announcement, or insight..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.body.length}/2000 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Media (Optional)
                  </label>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {isUploading ? "Uploading..." : "Upload Images/Videos"}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      disabled={isUploading || isSubmitting}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Max 20 files, 10MB each
                  </p>

                  {formData.mediaIds.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                      {formData.mediaIds.map((mediaId, index) => (
                        <div
                          key={mediaId}
                          className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group"
                        >
                          <Image
                            src={getMediaUrl(mediaId)}
                            alt={`Media ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading || !formData.body}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? "Saving..." : editingId ? "Update" : "Post"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </>
      )}

      {displayPosts.length === 0 ? (
        <p className="text-text-body text-center py-12">
          No posts yet.{" "}
          {enableCRUD &&
            "Create your first post to share updates with your audience!"}
        </p>
      ) : (
        <div className="space-y-4">
          {displayPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              showFullContent={showFullContent}
              className={editingId === post.id ? "ring-2 ring-primary" : ""}
              enableCRUD={enableCRUD}
              onEdit={() => handleEdit(post)}
              onDelete={() => handleDelete(post.id)}
              isSubmitting={isSubmitting}
              isEditing={editingId !== null}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface PostCardProps {
  post: Post;
  showFullContent?: boolean;
  className?: string;
  enableCRUD?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
  isEditing?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  showFullContent = false,
  className = "",
  enableCRUD = false,
  onEdit,
  onDelete,
  isSubmitting = false,
  isEditing = false,
}) => {
  return (
    <div
      className={`bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700">
            Post
          </span>
          <span className="text-xs text-gray-500">{formatPostDate(post)}</span>
        </div>
        {enableCRUD && onEdit && onDelete && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              disabled={isSubmitting || isEditing}
              className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit post"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              disabled={isSubmitting}
              className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {post.body && (
        <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">
          {showFullContent ? post.body : getPostExcerpt(post, 200)}
        </p>
      )}

      {post.mediaIds && post.mediaIds.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {post.mediaIds.slice(0, 3).map((mediaId, index) => (
            <div
              key={mediaId}
              className="relative aspect-video bg-gray-200 rounded overflow-hidden"
            >
              <Image
                src={getMediaUrl(mediaId)}
                alt={`Post media ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
          {post.mediaIds.length > 3 && (
            <div className="relative aspect-video bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-600">
                +{post.mediaIds.length - 3}
              </span>
            </div>
          )}
        </div>
      )}

      {post.organizationName && post.organizationId && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            By{" "}
            <Link
              href={`/profile/${post.organizationId}`}
              className="font-medium text-primary hover:text-primary-dark hover:underline"
            >
              {post.organizationName}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};
