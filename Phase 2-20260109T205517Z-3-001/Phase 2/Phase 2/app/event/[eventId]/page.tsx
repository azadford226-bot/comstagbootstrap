"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getEvent,
  registerForEvent,
  unregisterFromEvent,
  deleteEvent,
  Event,
} from "@/lib/api";
import { formatDate, formatTime } from "@/lib/utils/date";
import { useAuth } from "@/hooks/use-auth";
import LoadingSpinner from "@/components/atoms/loading-spinner";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Note: organizationId is not available in user object, so we check userType instead
  const isOwner = user?.userType === "ORGANIZATION";
  const canRegister = user?.userType === "CONSUMER" && !event?.isRegistered;
  const canUnregister = user?.userType === "CONSUMER" && event?.isRegistered;

  useEffect(() => {
    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const result = await getEvent(eventId);

      if (result.success && result.data) {
        setEvent(result.data);
      } else {
        setError(result.message || "Failed to load event");
      }
    } catch (err) {
      console.error("Error loading event:", err);
      setError("An error occurred while loading the event");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!canRegister) return;

    try {
      setActionLoading(true);
      const result = await registerForEvent(eventId);

      if (result.success) {
        setEvent((prev) =>
          prev
            ? {
                ...prev,
                isRegistered: true,
                registrationsCount: (prev.registrationsCount || 0) + 1,
              }
            : null
        );
      } else {
        setError(result.message || "Failed to register for event");
      }
    } catch (err) {
      console.error("Error registering for event:", err);
      setError("An error occurred while registering");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!canUnregister) return;

    try {
      setActionLoading(true);
      const result = await unregisterFromEvent(eventId);

      if (result.success) {
        setEvent((prev) =>
          prev
            ? {
                ...prev,
                isRegistered: false,
                registrationsCount: Math.max(
                  (prev.registrationsCount || 1) - 1,
                  0
                ),
              }
            : null
        );
      } else {
        setError(result.message || "Failed to unregister from event");
      }
    } catch (err) {
      console.error("Error unregistering from event:", err);
      setError("An error occurred while unregistering");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/event/${eventId}/edit`);
  };

  const handleDelete = async () => {
    if (
      !isOwner ||
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    )
      return;

    try {
      setActionLoading(true);
      const result = await deleteEvent(eventId);

      if (result.success) {
        router.push("/profile");
      } else {
        setError(result.message || "Failed to delete event");
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("An error occurred while deleting the event");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600">
            The event you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.startAt);
  const endDate = event.endAt ? new Date(event.endAt) : null;
  const isUpcoming = startDate > new Date();
  const isOngoing =
    startDate <= new Date() && (!endDate || endDate >= new Date());

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="p-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  isUpcoming
                    ? "bg-blue-100 text-blue-700"
                    : isOngoing
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {isUpcoming ? "Upcoming" : isOngoing ? "Ongoing" : "Past"}
              </span>
              {event.online && (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-700">
                  Online
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isOwner && (
                <>
                  <button
                    onClick={handleEdit}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </>
              )}

              {canRegister && isUpcoming && (
                <button
                  onClick={handleRegister}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading ? "Registering..." : "Register"}
                </button>
              )}

              {canUnregister && (
                <button
                  onClick={handleUnregister}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? "Unregistering..." : "Unregister"}
                </button>
              )}
            </div>
          </div>

          {/* Event Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {event.title}
          </h1>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Date & Time */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Date & Time</h3>
              <div className="space-y-1 text-gray-600">
                <div>
                  <strong>Start:</strong> {formatDate(event.startAt)} at{" "}
                  {formatTime(event.startAt)}
                </div>
                {event.endAt && (
                  <div>
                    <strong>End:</strong> {formatDate(event.endAt)} at{" "}
                    {formatTime(event.endAt)}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
              {event.online ? (
                <div className="text-gray-600">
                  <div>Online Event</div>
                  {event.onlineLink && (
                    <a
                      href={event.onlineLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Join Event
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-gray-600">
                  {event.address && <div>{event.address}</div>}
                  {(event.city || event.state || event.country) && (
                    <div>
                      {[event.city, event.state, event.country]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Industry */}
            {event.industryName && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Industry</h3>
                <div className="text-gray-600">{event.industryName}</div>
              </div>
            )}

            {/* Registration Count */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Registrations
              </h3>
              <div className="text-gray-600">
                {event.registrationsCount || 0} people registered
              </div>
            </div>
          </div>

          {/* Description */}
          {event.body && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <div className="text-gray-600 whitespace-pre-wrap">
                {event.body}
              </div>
            </div>
          )}

          {/* Organizer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Organizer</h3>
            <div className="text-gray-600">{event.organizationName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
