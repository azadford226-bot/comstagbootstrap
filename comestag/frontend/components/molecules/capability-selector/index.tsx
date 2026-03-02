"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export interface Capability {
  title: string;
  body: string;
  hashtags: number[];
}

interface CapabilitySelectorProps {
  capabilities: Capability[];
  onChange: (capabilities: Capability[]) => void;
}

export default function CapabilitySelector({
  capabilities,
  onChange,
}: CapabilitySelectorProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCapability, setNewCapability] = useState<Capability>({
    title: "",
    body: "",
    hashtags: [],
  });

  const handleAdd = () => {
    if (newCapability.title && newCapability.body) {
      onChange([...capabilities, newCapability]);
      setNewCapability({ title: "", body: "", hashtags: [] });
      setIsAddingNew(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(capabilities.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[16px] font-medium text-text-dark">
          Capabilities
          <span className="text-sm text-gray-500 ml-2">(Optional)</span>
        </label>
        {!isAddingNew && (
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Capability</span>
          </button>
        )}
      </div>

      {/* Existing capabilities */}
      {capabilities.length > 0 && (
        <div className="space-y-2">
          {capabilities.map((cap, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium text-text-dark">{cap.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{cap.body}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new capability form */}
      {isAddingNew && (
        <div className="p-4 border border-gray-200 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Capability Title"
            value={newCapability.title}
            onChange={(e) =>
              setNewCapability({ ...newCapability, title: e.target.value })
            }
            className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-text-dark outline-none"
          />
          <textarea
            placeholder="Capability Description"
            value={newCapability.body}
            onChange={(e) =>
              setNewCapability({ ...newCapability, body: e.target.value })
            }
            rows={3}
            className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-text-dark outline-none resize-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newCapability.title || !newCapability.body}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setNewCapability({ title: "", body: "", hashtags: [] });
              }}
              className="px-4 py-2 border border-gray-300 text-text-dark rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {capabilities.length === 0 && !isAddingNew && (
        <p className="text-sm text-gray-500 italic">
          No capabilities added yet. Click &quot;Add Capability&quot; to get
          started.
        </p>
      )}
    </div>
  );
}
