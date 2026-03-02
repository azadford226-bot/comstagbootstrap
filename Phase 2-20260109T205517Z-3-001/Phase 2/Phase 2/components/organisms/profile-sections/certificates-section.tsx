"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AuthenticatedImage } from "@/components/atoms/authenticated-image";
import { Plus, Edit2, Trash2, X, Save, Upload } from "lucide-react";
import {
  Certificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "@/lib/api/content";
import { uploadCertificateMedia, getMediaUrl } from "@/lib/api/media";

interface CertificatesSectionProps {
  certificates: Certificate[];
  onUpdate: () => void;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  certificates,
  onUpdate,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    imageId: "",
    title: "",
    body: "",
    link: "",
    certificateDate: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = () => {
    setFormData({
      imageId: "",
      title: "",
      body: "",
      link: "",
      certificateDate: "",
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setEditingId(null);
    setIsAdding(true);
    setError("");
  };

  const handleEdit = (certificate: Certificate) => {
    setFormData({
      imageId: certificate.image?.id || certificate.imageId || "",
      title: certificate.title,
      body: certificate.body || "",
      link: certificate.link || "",
      certificateDate: certificate.certificateDate
        ? certificate.certificateDate.split("T")[0]
        : "",
    });
    const imageId = certificate.image?.id || certificate.imageId || "";
    setPreviewUrl(imageId ? getMediaUrl(imageId) : "");
    setSelectedFile(null);
    setEditingId(certificate.id);
    setIsAdding(false);
    setError("");
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      imageId: "",
      title: "",
      body: "",
      link: "",
      certificateDate: "",
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      let imageId = formData.imageId;

      // Upload new image if selected
      if (selectedFile) {
        setIsUploading(true);
        const uploadResult = await uploadCertificateMedia(selectedFile);
        setIsUploading(false);

        console.log("Certificate media upload result:", uploadResult);

        if (!uploadResult.success || !uploadResult.data?.id) {
          console.error("Media upload failed or no ID returned:", uploadResult);
          setError(uploadResult.message || "Failed to upload image");
          setIsSubmitting(false);
          return;
        }
        imageId = uploadResult.data.id;
        console.log("Using media ID:", imageId);
      }

      if (!imageId) {
        setError("Certificate image is required");
        setIsSubmitting(false);
        return;
      }

      const certData = {
        imageId,
        title: formData.title,
        body: formData.body,
        link: formData.link,
        certificateDate:
          formData.certificateDate || new Date().toISOString().split("T")[0],
      };

      console.log("Creating certificate with data:", certData);

      if (editingId) {
        const result = await updateCertificate(editingId, certData);
        if (!result.success) {
          setError(result.message || "Failed to update certificate");
          setIsSubmitting(false);
          return;
        }
      } else {
        const result = await createCertificate(certData);
        console.log("Certificate creation result:", result);
        if (!result.success) {
          setError(result.message || "Failed to create certificate");
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
    if (!confirm("Are you sure you want to delete this certificate?")) return;

    setIsSubmitting(true);
    try {
      const result = await deleteCertificate(id);
      if (result.success) {
        onUpdate();
      } else {
        alert(result.message || "Failed to delete certificate");
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
        <h2 className="text-2xl font-bold text-primary-dark">Certifications</h2>
        {!isAdding && !editingId && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
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
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Certificate Image *
              </label>
              <div className="flex gap-4">
                <div className="shrink-0">
                  {previewUrl ? (
                    <div className="relative w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload a clear image of your certificate (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Certificate Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                maxLength={100}
                className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none h-12"
                placeholder="e.g., AWS Certified Solutions Architect"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                rows={2}
                maxLength={200}
                className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none resize-none"
                placeholder="Brief description or issuing organization"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Certificate Date
                </label>
                <input
                  type="date"
                  value={formData.certificateDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      certificateDate: e.target.value,
                    })
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark outline-none h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Link
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none h-12"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  isUploading ||
                  !formData.title ||
                  (!formData.imageId && !selectedFile)
                }
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                {isUploading
                  ? "Uploading..."
                  : isSubmitting
                  ? "Saving..."
                  : editingId
                  ? "Update"
                  : "Add"}
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {certificates.length === 0 ? (
          <div className="col-span-2 sm:col-span-3 lg:col-span-4">
            <p className="text-text-body text-center py-8">
              No certificates yet. Add your certifications to showcase your
              credentials!
            </p>
          </div>
        ) : (
          certificates.map((cert) => (
            <div
              key={cert.id}
              className={`border-2 rounded-lg p-2 hover:shadow-lg transition-all flex flex-col ${
                editingId === cert.id
                  ? "border-primary ring-2 ring-primary"
                  : "border-gray-200"
              }`}
            >
              {(cert.image?.id || cert.imageId) && (
                <div className="relative aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                  <AuthenticatedImage
                    src={getMediaUrl(cert.image?.id || cert.imageId || "")}
                    alt={cert.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h4 className="font-semibold text-xs text-text-dark mb-1 line-clamp-2">
                {cert.title}
              </h4>
              <div className="h-7 mb-1.5">
                {cert.body && (
                  <p className="text-xs text-text-body line-clamp-2">
                    {cert.body}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-1.5">
                {new Date(cert.certificateDate).toLocaleDateString()}
              </p>
              <div className="h-5 mb-1.5">
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline block truncate"
                  >
                    View Certificate →
                  </a>
                )}
              </div>
              <div className="flex gap-1.5 pt-1.5 border-t mt-auto">
                <button
                  onClick={() => handleEdit(cert)}
                  disabled={isSubmitting}
                  className="flex-1 p-1 text-primary hover:bg-primary hover:text-white rounded transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5 mx-auto" />
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  disabled={isSubmitting}
                  className="flex-1 p-1 text-red-600 hover:bg-red-600 hover:text-white rounded transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 mx-auto" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
