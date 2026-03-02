"use client";

import React, { useState } from "react";
import { Trash2, Edit3, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  GlobeIcon,
  LocationIcon,
  UsersIcon,
} from "@/components/atoms/icon";
import { Event, deleteEvent } from "@/lib/api/events";
import {
  formatDate,
  formatTime,
  sortByDateDesc,
  isFutureDate,
  timeUntil,
} from "@/lib/utils";

interface EventsSectionProps {
  events: Event[];
  onUpdate: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  onUpdate,
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const sortedEvents = sortByDateDesc(events);
  const upcomingEvents = sortedEvents.filter((e) => isFutureDate(e.startAt));
  const pastEvents = sortedEvents.filter((e) => !isFutureDate(e.startAt));

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (
      !confirm(`Are you sure you want to delete the event "${eventTitle}"?`)
    ) {
      return;
    }

    setIsDeleting(eventId);
    try {
      const result = await deleteEvent(eventId);
      if (result.success) {
        onUpdate(); // Refresh the events list
      } else {
        alert(`Failed to delete event: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const EventCard = ({ event }: { event: Event }) => {
    const isUpcoming = isFutureDate(event.startAt);

    return (
      <div className="border border-light-gray rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-text-dark flex-1 line-clamp-2">
              {event.title}
            </h3>
            <div className="flex items-center gap-1 ml-2">
              {isUpcoming && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded whitespace-nowrap">
                  {timeUntil(event.startAt)}
                </span>
              )}
            </div>
          </div>

          {event.body && (
            <p className="text-sm text-text-body mb-3 line-clamp-2">
              {event.body}
            </p>
          )}

          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center gap-2 text-text-body">
              <CalendarIcon className="w-4 h-4" />
              <span>
                {formatDate(event.startAt)} at {formatTime(event.startAt)}
              </span>
            </div>

            {event.online ? (
              <div className="flex items-center gap-2 text-primary">
                <GlobeIcon className="w-4 h-4" />
                <span className="font-medium">Online Event</span>
              </div>
            ) : (
              (event.city || event.state || event.country) && (
                <div className="flex items-center gap-2 text-text-body">
                  <LocationIcon className="w-4 h-4" />
                  <span>
                    {[event.city, event.state, event.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )
            )}

            {event.registrationsCount !== undefined && (
              <div className="flex items-center gap-2 text-text-body">
                <UsersIcon className="w-4 h-4" />
                <span>{event.registrationsCount} registered</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Link
              href={`/event/${event.id}`}
              className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 transition-colors text-center"
            >
              <ExternalLink className="w-4 h-4 inline mr-1" />
              View Details
            </Link>

            <Link
              href={`/event/${event.id}/edit`}
              className="px-3 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 transition-colors"
              title="Edit Event"
            >
              <Edit3 className="w-4 h-4" />
            </Link>

            <button
              onClick={() => handleDelete(event.id, event.title)}
              disabled={isDeleting === event.id}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-all disabled:opacity-50"
              title="Delete Event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          Our Events
        </h2>
        <button
          onClick={() => router.push("/event/create")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {sortedEvents.length > 0 ? (
        <div className="space-y-6">
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Upcoming Events ({upcomingEvents.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Past Events ({pastEvents.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4">
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Events Yet
          </h3>
          <p className="text-text-body mb-6">
            Start organizing events to connect with your community and showcase
            your expertise.
          </p>
          <button
            onClick={() => router.push("/event/create")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Your First Event
          </button>
        </div>
      )}
    </div>
  );
};
