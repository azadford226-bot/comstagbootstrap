"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";
import {
  Capability,
  createCapability,
  updateCapability,
  deleteCapability,
} from "@/lib/api/capabilities";

interface CapabilitiesSectionProps {
  capabilities: Capability[];
  onUpdate: () => void;
}

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({
  capabilities,
  onUpdate,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    hashtags: [] as number[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = () => {
    setFormData({ title: "", body: "", hashtags: [] });
    setEditingId(null);
    setIsAdding(true);
    setError("");
  };

  const handleEdit = (capability: Capability) => {
    setFormData({
      title: capability.title,
      body: capability.body,
      hashtags: capability.hashtags || [],
    });
    setEditingId(capability.id);
    setIsAdding(false);
    setError("");
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: "", body: "", hashtags: [] });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (editingId) {
        const result = await updateCapability(editingId, formData);
        if (!result.success) {
          setError(result.message || "Failed to update capability");
          setIsSubmitting(false);
          return;
        }
      } else {
        const result = await createCapability(formData);
        if (!result.success) {
          setError(result.message || "Failed to create capability");
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
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this capability?")) return;

    setIsSubmitting(true);
    try {
      const result = await deleteCapability(id);
      if (result.success) {
        onUpdate();
      } else {
        alert(result.message || "Failed to delete capability");
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
          Our Capabilities
        </h2>
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
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
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
                placeholder="e.g., Web Development, Data Analytics"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                required
                rows={3}
                maxLength={500}
                className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none resize-none"
                placeholder="Describe this capability in detail..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.body.length}/500 characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.body}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Saving..." : editingId ? "Update" : "Add"}
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

      <div className="space-y-4">
        {capabilities.length === 0 ? (
          <p className="text-text-body text-center py-8">
            No capabilities yet. Add your first capability to showcase your
            expertise!
          </p>
        ) : (
          capabilities.map((capability) => (
            <div
              key={capability.id}
              className={`border-l-4 border-primary pl-4 py-3 rounded-r-lg bg-linear-to-r from-blue-50 to-transparent hover:from-blue-100 transition-all ${
                editingId === capability.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-text-dark mb-1">
                    {capability.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed">
                    {capability.body}
                  </p>
                  {capability.createdAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      Added{" "}
                      {new Date(capability.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(capability)}
                    disabled={isSubmitting}
                    className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(capability.id)}
                    disabled={isSubmitting}
                    className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
