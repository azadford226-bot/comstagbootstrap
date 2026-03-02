"use client";

import { useState } from "react";
import { Plus, X, Upload, XCircle, Edit2 } from "lucide-react";
import { uploadSuccessStoryMedia } from "@/lib/api/media";
import Image from "next/image";
import { getMediaUrl } from "@/lib/api/media";

export interface SuccessStory {
  id?: string;
  title: string;
  body: string;
  mediaIds?: string[];
  hashtags: number[];
}

interface SuccessStoryUploaderProps {
  stories: SuccessStory[];
  onChange: (stories: SuccessStory[]) => void;
}

export default function SuccessStoryUploader({
  stories,
  onChange,
}: SuccessStoryUploaderProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newStory, setNewStory] = useState<SuccessStory>({
    title: "",
    body: "",
    mediaIds: [],
    hashtags: [],
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalFiles = selectedFiles.length + files.length;

    if (totalFiles > 20) {
      setUploadError("Maximum 20 files allowed");
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("Each file must be less than 10MB");
        return false;
      }
      return true;
    });

    setSelectedFiles([...selectedFiles, ...validFiles]);
    setPreviewUrls([
      ...previewUrls,
      ...validFiles.map((f) => URL.createObjectURL(f)),
    ]);
    setUploadError("");
  };

  const removePreview = (index: number) => {
    const existingMediaCount = newStory.mediaIds?.length || 0;

    if (index < existingMediaCount) {
      // Remove from existing media IDs
      setNewStory({
        ...newStory,
        mediaIds: newStory.mediaIds?.filter((_, i) => i !== index),
      });
      setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    } else {
      // Remove from newly selected files
      const fileIndex = index - existingMediaCount;
      setSelectedFiles(selectedFiles.filter((_, i) => i !== fileIndex));
      setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (index: number) => {
    const story = stories[index];
    setNewStory({
      title: story.title,
      body: story.body,
      mediaIds: story.mediaIds || [],
      hashtags: story.hashtags || [],
    });
    setPreviewUrls((story.mediaIds || []).map((id) => getMediaUrl(id)));
    setSelectedFiles([]);
    setEditingIndex(index);
    setIsAddingNew(false);
  };

  const handleSave = async () => {
    if (!newStory.title || !newStory.body) {
      setUploadError("Please fill title and body");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const existingMediaIds = [...(newStory.mediaIds || [])];
      let uploadedMediaIds: string[] = [];

      // Upload new files if any
      if (selectedFiles.length > 0) {
        const uploadResult = await uploadSuccessStoryMedia(selectedFiles);
        if (uploadResult.success && uploadResult.data?.mediaIds) {
          uploadedMediaIds = uploadResult.data.mediaIds;
        } else {
          setUploadError(uploadResult.message || "Failed to upload media");
          setIsUploading(false);
          return;
        }
      }

      const mediaIds = [...existingMediaIds, ...uploadedMediaIds];

      const updatedStory = {
        ...newStory,
        mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
        hashtags: newStory.hashtags.length > 0 ? newStory.hashtags : [1],
      };

      if (editingIndex !== null) {
        // Update existing story
        const updatedStories = [...stories];
        updatedStories[editingIndex] = updatedStory;
        onChange(updatedStories);
      } else {
        // Add new story
        onChange([...stories, updatedStory]);
      }

      // Reset form
      setNewStory({
        title: "",
        body: "",
        mediaIds: [],
        hashtags: [],
      });
      setSelectedFiles([]);
      setPreviewUrls([]);
      setIsAddingNew(false);
      setEditingIndex(null);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to save story"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(stories.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingIndex(null);
    setNewStory({
      title: "",
      body: "",
      mediaIds: [],
      hashtags: [],
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setUploadError("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[16px] font-medium text-text-dark">
          Success Stories
          <span className="text-sm text-gray-500 ml-2">(Optional)</span>
        </label>
        {!isAddingNew && editingIndex === null && (
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Success Story</span>
          </button>
        )}
      </div>

      {/* Existing stories */}
      {stories.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {stories.map((story, index) => (
            <div
              key={index}
              className="relative p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="text-blue-500 hover:text-blue-700 bg-white rounded-full p-1"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-red-500 hover:text-red-700 bg-white rounded-full p-1"
                  title="Delete"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-medium text-text-dark pr-16">
                {story.title}
              </h4>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {story.body}
              </p>
              {story.mediaIds && story.mediaIds.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {story.mediaIds.slice(0, 4).map((mediaId, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded overflow-hidden"
                    >
                      <Image
                        src={getMediaUrl(mediaId)}
                        alt="Story media"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {story.mediaIds.length > 4 && (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-600">
                        +{story.mediaIds.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit story form */}
      {(isAddingNew || editingIndex !== null) && (
        <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-white">
          <input
            type="text"
            placeholder="Story Title *"
            value={newStory.title}
            onChange={(e) =>
              setNewStory({ ...newStory, title: e.target.value })
            }
            maxLength={200}
            className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-text-dark outline-none"
          />

          <textarea
            placeholder="Story Details *"
            value={newStory.body}
            onChange={(e) => setNewStory({ ...newStory, body: e.target.value })}
            rows={4}
            maxLength={2000}
            className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-text-dark outline-none resize-none"
          />
          <p className="text-xs text-gray-500">
            {newStory.body.length}/2000 characters
          </p>

          {/* Media Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Media Files (Optional - Up to 20)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Choose Files</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFilesSelect}
                  className="hidden"
                />
              </label>
              {selectedFiles.length > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedFiles.length} file(s) selected
                </span>
              )}
            </div>
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {previewUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePreview(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isUploading || !newStory.title || !newStory.body}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : editingIndex !== null ? (
                "Update Story"
              ) : (
                "Add Story"
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUploading}
              className="px-4 py-2 border border-gray-300 text-text-dark rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {stories.length === 0 && !isAddingNew && (
        <p className="text-sm text-gray-500 italic">
          No success stories added yet. Click &quot;Add Success Story&quot; to
          showcase your achievements.
        </p>
      )}
    </div>
  );
}
