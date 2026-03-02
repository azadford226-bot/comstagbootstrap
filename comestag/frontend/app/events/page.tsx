"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getMyEventRegistrations,
  getRecommendedEvents,
  unregisterFromEvent,
  registerForEvent,
  Event,
} from "@/lib/api";
import { formatDate, formatTime, isUpcoming } from "@/lib/utils/date";
import LoadingSpinner from "@/components/atoms/loading-spinner";
import {
  mockApiResponse,
  mockEvents,
  mockMyEventRegistrations,
} from "@/lib/dev-mock-api";

export default function EventRegistrationsPage() {
  const [myRegistrations, setMyRegistrations] = useState<Event[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"registered" | "recommended">(
    "registered"
  );

  const getStatusCode = (value: unknown): number | undefined => {
    if (typeof value !== "object" || value === null) return undefined;
    if (!("status" in value)) return undefined;
    const maybeStatus = (value as { status?: unknown }).status;
    return typeof maybeStatus === "number" ? maybeStatus : undefined;
  };

  const getErrorMessage = (value: unknown, fallback: string): string => {
    if (typeof value !== "object" || value === null) return fallback;
    if (!("message" in value)) return fallback;
    const maybeMessage = (value as { message?: unknown }).message;
    return typeof maybeMessage === "string" && maybeMessage.length > 0
      ? maybeMessage
      : fallback;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      
      const [registrationsResult, recommendedResult] = await Promise.all([
        mockApiResponse(() => getMyEventRegistrations(), {
          items: mockMyEventRegistrations,
          totalItems: mockMyEventRegistrations.length,
          totalPages: 1,
          page: 1,
          size: mockMyEventRegistrations.length,
        }).catch(() => {
          // If not authenticated, return empty list for registrations
          console.log("Not authenticated for registrations, using empty list");
          return {
            success: true,
            data: {
              items: [],
              totalItems: 0,
              totalPages: 1,
              page: 1,
              size: 0,
            },
          };
        }),
        mockApiResponse(() => getRecommendedEvents(), {
          items: mockEvents,
          totalItems: mockEvents.length,
          totalPages: 1,
          page: 1,
          size: mockEvents.length,
        }).catch((err: unknown) => {
          // If recommended events fail, still try to show empty state gracefully
          console.error("Error loading recommended events:", err);
          return {
            success: false,
            message: getErrorMessage(err, "Failed to load recommended events"),
          };
        }),
      ]);

      if (registrationsResult.success) {
        setMyRegistrations(registrationsResult.data?.items || []);
      } else {
        // Don't show error for registrations if user is not authenticated
        const status = getStatusCode(registrationsResult);
        if (status !== 403) {
          const errorMessage = getErrorMessage(
            registrationsResult,
            "Failed to load registrations"
          );
          setError(errorMessage);
        }
      }

      if (recommendedResult.success && 'data' in recommendedResult) {
        setRecommendedEvents(recommendedResult.data?.items || []);
      } else {
        // Only show error for recommended events if it's not a 403 (auth error)
        const status = getStatusCode(recommendedResult);
        if (status !== 403) {
          const errorMessage = getErrorMessage(
            recommendedResult,
            "Failed to load recommended events"
          );
          setError(errorMessage);
        }
      }
    } catch (err) {
      console.error("Error loading events:", err);
      // Don't set error for auth failures - just show empty state
      if (getStatusCode(err) !== 403) {
        setError("An error occurred while loading events");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!confirm("Are you sure you want to unregister from this event?"))
      return;

    try {
      setActionLoading(eventId);
      const result = await unregisterFromEvent(eventId);

      if (result.success) {
        setMyRegistrations((prev) =>
          prev.filter((event) => event.id !== eventId)
        );
        // Add back to recommended if it's not there
        const event = myRegistrations.find((e) => e.id === eventId);
        if (event && !recommendedEvents.find((e) => e.id === eventId)) {
          setRecommendedEvents((prev) => [
            { ...event, isRegistered: false },
            ...prev,
          ]);
        }
      } else {
        setError(result.message || "Failed to unregister from event");
      }
    } catch (err) {
      console.error("Error unregistering from event:", err);
      setError("An error occurred while unregistering");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      setActionLoading(eventId);
      const result = await registerForEvent(eventId);

      if (result.success) {
        // Move from recommended to registered
        const event = recommendedEvents.find((e) => e.id === eventId);
        if (event) {
          setRecommendedEvents((prev) => prev.filter((e) => e.id !== eventId));
          setMyRegistrations((prev) => [
            { ...event, isRegistered: true },
            ...prev,
          ]);
        }
      } else {
        setError(result.message || "Failed to register for event");
      }
    } catch (err) {
      console.error("Error registering for event:", err);
      setError("An error occurred while registering");
    } finally {
      setActionLoading(null);
    }
  };

  const EventCard = ({
    event,
    showUnregister = false,
  }: {
    event: Event;
    showUnregister?: boolean;
  }) => (
    <div className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
      <Link href={`/event/${event.id}`} className="block">
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
            {event.title}
          </h3>

          <div className="space-y-1 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {formatDate(event.startAt)} at {formatTime(event.startAt)}
              </span>
            </div>

            {!event.online && (event.city || event.state || event.country) && (
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  {[event.city, event.state, event.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              {event.organizationId ? (
                <Link
                  href={`/profile/${event.organizationId}`}
                  className="hover:text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {event.organizationName}
                </Link>
              ) : (
                <span>{event.organizationName}</span>
              )}
            </div>
          </div>

          {event.body && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {event.body}
            </p>
          )}
        </div>
      </Link>

      <div className="px-4 pb-4">
        {showUnregister ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleUnregister(event.id);
            }}
            disabled={actionLoading === event.id}
            className="w-full px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
          >
            {actionLoading === event.id ? "Unregistering..." : "Unregister"}
          </button>
        ) : isUpcoming(event.startAt) ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleRegister(event.id);
            }}
            disabled={actionLoading === event.id}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {actionLoading === event.id ? "Registering..." : "Register"}
          </button>
        ) : (
          <div className="w-full px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded text-center">
            Past Event
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[50px] py-6 md:py-[46px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">My Events</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("registered")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "registered"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Registered Events ({myRegistrations.length})
            </button>
            <button
              onClick={() => setActiveTab("recommended")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "recommended"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Recommended Events ({recommendedEvents.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "registered" && (
          <div>
            {myRegistrations.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No Events Registered
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven&apos;t registered for any events yet. Check out
                  recommended events to find something interesting!
                </p>
                <button
                  onClick={() => setActiveTab("recommended")}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Browse Recommended Events
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRegistrations.map((event) => (
                  <EventCard key={event.id} event={event} showUnregister />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "recommended" && (
          <div>
            {recommendedEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No Recommended Events
                </h3>
                <p className="text-gray-600">
                  No recommended events are available at the moment. Check back
                  later!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
