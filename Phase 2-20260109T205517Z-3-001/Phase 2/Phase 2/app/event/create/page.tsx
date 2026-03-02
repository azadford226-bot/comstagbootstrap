"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent, EventRequest } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import LoadingSpinner from "@/components/atoms/loading-spinner";
import Button from "@/components/atoms/button";

export default function CreateEventPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<EventRequest>({
    title: "",
    body: "",
    startAt: "",
    endAt: "",
    online: false,
    onlineLink: "",
    country: "",
    state: "",
    city: "",
    address: "",
  });

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect if not organization user
  if (user?.userType !== "ORGANIZATION") {
    router.push("/profile");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      // Prepare data - remove empty strings
      const eventData: EventRequest = {
        title: formData.title,
        startAt: formData.startAt,
        online: formData.online,
      };

      // Add optional fields only if they have values
      if (formData.body?.trim()) eventData.body = formData.body.trim();
      if (formData.endAt) eventData.endAt = formData.endAt;
      if (formData.industry) eventData.industry = formData.industry;
      if (formData.country?.trim()) eventData.country = formData.country.trim();
      if (formData.state?.trim()) eventData.state = formData.state.trim();
      if (formData.city?.trim()) eventData.city = formData.city.trim();
      if (formData.address?.trim()) eventData.address = formData.address.trim();
      if (formData.onlineLink?.trim())
        eventData.onlineLink = formData.onlineLink.trim();

      const result = await createEvent(eventData);

      if (result.success && result.data) {
        router.push(`/event/${result.data.id}`);
      } else {
        setError(result.message || "Failed to create event");
      }
    } catch (err) {
      console.error("Error creating event:", err);
      setError("An error occurred while creating the event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Create New Event
            </h1>
            <button
              onClick={() => router.push("/profile")}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none h-12"
                required
                placeholder="Enter event title"
              />
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.body || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, body: e.target.value }))
                }
                rows={4}
                className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none resize-none"
                placeholder="Describe your event..."
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startAt: e.target.value,
                    }))
                  }
                  className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark outline-none h-12 [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:cursor-pointer invalid:border-0 invalid:shadow-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.endAt || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endAt: e.target.value }))
                  }
                  className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark outline-none h-12 [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:cursor-pointer invalid:border-0 invalid:shadow-none"
                />
              </div>
            </div>

            {/* Online Event Toggle */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.online}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      online: e.target.checked,
                    }))
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Online Event
                </span>
              </label>
            </div>

            {/* Online Link */}
            {formData.online && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Online Link
                </label>
                <input
                  type="url"
                  value={formData.onlineLink || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      onlineLink: e.target.value,
                    }))
                  }
                  className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none h-12"
                  placeholder="https://zoom.us/j/..."
                />
              </div>
            )}

            {/* Location (if not online) */}
            {!formData.online && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none h-12"
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none h-12"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none h-12"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none h-12"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="secondary"
                size="small"
                onClick={() => router.push("/profile")}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="small"
                buttonType="submit"
                disabled={saving}
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner className="w-4 h-4" />
                    Creating...
                  </div>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
