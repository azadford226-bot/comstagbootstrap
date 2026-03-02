"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Save, XCircle } from "lucide-react";
import {
  SuccessStory,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
} from "@/lib/api/content";
import { uploadSuccessStoryMedia, getMediaUrl } from "@/lib/api/media";

interface SuccessStoriesSectionProps {
  stories: SuccessStory[];
  onUpdate: () => void;
}

export const SuccessStoriesSection: React.FC<SuccessStoriesSectionProps> = ({
  stories,
  onUpdate,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    mediaIds: [] as string[],
    hashtags: [] as number[],
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = () => {
    setFormData({ title: "", body: "", mediaIds: [], hashtags: [] });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setEditingId(null);
    setIsAdding(true);
    setError("");
  };

  const handleEdit = (story: SuccessStory) => {
    setFormData({
      title: story.title,
      body: story.body,
      mediaIds: story.mediaIds || [],
      hashtags: story.hashtags || [],
    });
    setPreviewUrls((story.mediaIds || []).map((id) => getMediaUrl(id)));
    setSelectedFiles([]);
    setEditingId(story.id);
    setIsAdding(false);
    setError("");
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: "", body: "", mediaIds: [], hashtags: [] });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalFiles =
      selectedFiles.length + files.length + formData.mediaIds.length;

    if (totalFiles > 20) {
      setError("Maximum 20 media files allowed");
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        setError("Each file must be less than 10MB");
        return false;
      }
      return true;
    });

    setSelectedFiles([...selectedFiles, ...validFiles]);
    setPreviewUrls([
      ...previewUrls,
      ...validFiles.map((f) => URL.createObjectURL(f)),
    ]);
    setError("");
  };

  const removePreview = (index: number) => {
    if (index < formData.mediaIds.length) {
      // Remove existing media ID
      setFormData({
        ...formData,
        mediaIds: formData.mediaIds.filter((_, i) => i !== index),
      });
      setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    } else {
      // Remove newly selected file
      const fileIndex = index - formData.mediaIds.length;
      setSelectedFiles(selectedFiles.filter((_, i) => i !== fileIndex));
      setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const mediaIds = [...formData.mediaIds];

      // Upload new files (batch upload)
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        const uploadResult = await uploadSuccessStoryMedia(selectedFiles);
        if (uploadResult.success && uploadResult.data?.mediaIds) {
          mediaIds.push(...uploadResult.data.mediaIds);
        } else {
          setError(uploadResult.message || "Failed to upload media");
          setIsSubmitting(false);
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const storyData = {
        title: formData.title,
        body: formData.body,
        mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
        hashtags: formData.hashtags.length > 0 ? formData.hashtags : [1], // At least one hashtag required
      };

      if (editingId) {
        const result = await updateSuccessStory(editingId, storyData);
        if (!result.success) {
          setError(result.message || "Failed to update success story");
          setIsSubmitting(false);
          return;
        }
      } else {
        const result = await createSuccessStory(storyData);
        if (!result.success) {
          setError(result.message || "Failed to create success story");
          setIsSubmitting(false);
          return;
        }
      }

      handleCancel();
      onUpdate();
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this success story?")) return;

    setIsSubmitting(true);
    try {
      const result = await deleteSuccessStory(id);
      if (result.success) {
        onUpdate();
      } else {
        alert(result.message || "Failed to delete success story");
      }
    } catch {
      alert("An error occurred while deleting");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary-dark">
          Success Stories
        </h2>
        {!isAdding && !editingId && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Story
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
          className="mb-6 p-6 border-2 border-primary rounded-lg bg-blue-50"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Story Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                maxLength={200}
                className="bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none w-full h-12"
                placeholder="e.g., How We Helped XYZ Company Increase Revenue by 200%"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Story Details *
              </label>
              <textarea
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                required
                rows={6}
                maxLength={2000}
                className="bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none w-full resize-none"
                placeholder="Share the full story of your success... Include the challenge, your solution, and the results achieved."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.body.length}/2000 characters
              </p>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Media (Optional - Up to 20 images/videos)
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
              />
              <p className="text-xs text-gray-500 mt-2">
                Upload images or videos to illustrate your success story (max
                10MB each)
              </p>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-300"
                    >
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePreview(index)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  isUploading ||
                  !formData.title ||
                  !formData.body
                }
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                {isUploading
                  ? "Uploading Media..."
                  : isSubmitting
                  ? "Saving..."
                  : editingId
                  ? "Update Story"
                  : "Publish Story"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting || isUploading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {stories.length === 0 ? (
          <p className="text-text-body text-center py-8">
            No success stories yet. Share your achievements and showcase the
            impact of your work!
          </p>
        ) : (
          stories.map((story) => (
            <article
              key={story.id}
              className={`border-2 rounded-lg p-6 hover:shadow-lg transition-all ${
                editingId === story.id
                  ? "border-primary ring-2 ring-primary"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-primary-dark flex-1">
                  {story.title}
                </h3>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(story)}
                    disabled={isSubmitting}
                    className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    disabled={isSubmitting}
                    className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-text-body leading-relaxed mb-4 whitespace-pre-wrap">
                {story.body}
              </p>
              {story.mediaIds && story.mediaIds.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {story.mediaIds.slice(0, 6).map((mediaId) => (
                    <div
                      key={mediaId}
                      className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={getMediaUrl(mediaId)}
                        alt="Story media"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {story.mediaIds.length > 6 && (
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <p className="text-gray-600 font-semibold">
                        +{story.mediaIds.length - 6} more
                      </p>
                    </div>
                  )}
                </div>
              )}
              {story.createdAt && (
                <p className="text-xs text-gray-400">
                  Published {new Date(story.createdAt).toLocaleDateString()}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
};
