"use client";

import { useState } from "react";
import { Plus, X, Upload, ExternalLink } from "lucide-react";
import { uploadCertificateMedia } from "@/lib/api/media";
import Image from "next/image";

export interface Certificate {
  imageId?: string;
  imageUrl?: string;
  title: string;
  body: string;
  link: string;
  certificateDate: string;
}

interface CertificateUploaderProps {
  certificates: Certificate[];
  onChange: (certificates: Certificate[]) => void;
}

export default function CertificateUploader({
  certificates,
  onChange,
}: CertificateUploaderProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCertificate, setNewCertificate] = useState<Certificate>({
    title: "",
    body: "",
    link: "",
    certificateDate: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadError("");
    }
  };

  const handleAdd = async () => {
    if (
      !newCertificate.title ||
      !newCertificate.body ||
      !newCertificate.certificateDate ||
      !selectedFile
    ) {
      setUploadError("Please fill all required fields and select an image");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      // Upload image first
      const uploadResult = await uploadCertificateMedia(selectedFile);

      if (uploadResult.success && uploadResult.data) {
        // Add certificate with uploaded image ID
        onChange([
          ...certificates,
          {
            ...newCertificate,
            imageId: uploadResult.data.id, // Use 'id' property
            imageUrl: previewUrl, // Keep preview for display
          },
        ]);

        // Reset form
        setNewCertificate({
          title: "",
          body: "",
          link: "",
          certificateDate: "",
        });
        setSelectedFile(null);
        setPreviewUrl("");
        setIsAddingNew(false);
      } else {
        setUploadError(uploadResult.message || "Failed to upload image");
      }
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload certificate"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(certificates.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[16px] font-medium text-text-dark">
          Certificates
          <span className="text-sm text-gray-500 ml-2">(Optional)</span>
        </label>
        {!isAddingNew && (
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Certificate</span>
          </button>
        )}
      </div>

      {/* Existing certificates */}
      {certificates.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert, index) => (
            <div
              key={index}
              className="relative p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
              {cert.imageUrl && (
                <div className="relative w-full h-32 mb-2">
                  <Image
                    src={cert.imageUrl}
                    alt={cert.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
              <h4 className="font-medium text-text-dark">{cert.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{cert.body}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(cert.certificateDate).toLocaleDateString()}
              </p>
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                >
                  View Certificate <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add new certificate form */}
      {isAddingNew && (
        <div className="p-4 border border-gray-200 rounded-lg space-y-3">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Certificate Image *
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-600">
                  {selectedFile.name}
                </span>
              )}
            </div>
            {previewUrl && (
              <div className="relative w-full h-32">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Certificate Title *"
            value={newCertificate.title}
            onChange={(e) =>
              setNewCertificate({ ...newCertificate, title: e.target.value })
            }
            className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-text-dark outline-none"
          />

          <textarea
            placeholder="Certificate Description *"
            value={newCertificate.body}
            onChange={(e) =>
              setNewCertificate({ ...newCertificate, body: e.target.value })
            }
            rows={3}
            className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-text-dark outline-none resize-none"
          />

          <input
            type="url"
            placeholder="Certificate Link (optional)"
            value={newCertificate.link}
            onChange={(e) =>
              setNewCertificate({ ...newCertificate, link: e.target.value })
            }
            className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-text-dark outline-none"
          />

          <input
            type="date"
            value={newCertificate.certificateDate}
            onChange={(e) =>
              setNewCertificate({
                ...newCertificate,
                certificateDate: e.target.value,
              })
            }
            max={new Date().toISOString().split('T')[0]}
            className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-text-dark outline-none"
          />

          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={
                isUploading ||
                !newCertificate.title ||
                !newCertificate.body ||
                !newCertificate.certificateDate ||
                !selectedFile
              }
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                "Add Certificate"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setNewCertificate({
                  title: "",
                  body: "",
                  link: "",
                  certificateDate: "",
                });
                setSelectedFile(null);
                setPreviewUrl("");
                setUploadError("");
              }}
              disabled={isUploading}
              className="px-4 py-2 border border-gray-300 text-text-dark rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {certificates.length === 0 && !isAddingNew && (
        <p className="text-sm text-gray-500 italic">
          No certificates added yet. Click &quot;Add Certificate&quot; to
          showcase your credentials.
        </p>
      )}
    </div>
  );
}
