"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { getMediaUrl } from "@/lib/api/media";

interface MediaUploadProps {
  onUpload: (files: File[]) => Promise<string[]>;
  onRemove: (mediaId: string) => void;
  mediaIds: string[];
  maxFiles?: number;
  accept?: string;
  className?: string;
}

export default function MediaUpload({
  onUpload,
  onRemove,
  mediaIds,
  maxFiles = 10,
  accept = "image/*",
  className = "",
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (mediaIds.length + files.length > maxFiles) {
      setError(`Cannot upload more than ${maxFiles} files`);
      return;
    }

    try {
      setUploading(true);
      setError(null);
      await onUpload(files);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
      // Clear the input
      e.target.value = "";
    }
  };

  return (
    <div className={className}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Upload Button */}
      {mediaIds.length < maxFiles && (
        <div className="mb-4">
          <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                {mediaIds.length}/{maxFiles} files uploaded
              </p>
            </div>
            <input
              type="file"
              multiple
              accept={accept}
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Media Preview Grid */}
      {mediaIds.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaIds.map((mediaId) => (
            <div key={mediaId} className="relative group">
              <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={getMediaUrl(mediaId)}
                  alt="Uploaded media"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => onRemove(mediaId)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Uploading...</span>
        </div>
      )}
    </div>
  );
}
