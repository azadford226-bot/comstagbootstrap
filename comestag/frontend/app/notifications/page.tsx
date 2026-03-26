"use client";

import { useState, useEffect, useCallback } from "react";
import { NotificationSkeleton } from "@/components/ui/skeleton";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  archiveNotification,
  archiveAllNotifications,
  type NotificationView,
  type PageResult,
} from "@/lib/api/notifications";
import { notificationLabel, notificationCategory } from "@/lib/notification-labels";
import { useToast } from "@/components/ui/toast";

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function getIcon(type: string) {
  if (type.startsWith("OPPORTUNITY"))
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  if (type.startsWith("RFQ"))
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  if (type.startsWith("MESSAGE"))
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    );
  if (type.startsWith("POST"))
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    );
  if (type === "FOLLOW")
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    );
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function getIconBg(type: string) {
  if (type.startsWith("OPPORTUNITY")) return "bg-teal-100 text-teal-600";
  if (type.startsWith("RFQ")) return "bg-blue-100 text-blue-600";
  if (type.startsWith("MESSAGE")) return "bg-green-100 text-green-600";
  if (type.startsWith("POST")) return "bg-purple-100 text-purple-600";
  if (type === "FOLLOW") return "bg-amber-100 text-amber-600";
  return "bg-gray-100 text-gray-600";
}

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationView[]>([]);
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState<Omit<PageResult<NotificationView>, "items"> | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [category, setCategory] = useState<
    "all" | "rfq" | "message" | "social" | "system" | "opportunity"
  >("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [archiving, setArchiving] = useState(false);

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    const result = await getNotifications(p, 20);
    if (result.success && result.data) {
      setNotifications(result.data.items);
      setPageData({
        page: result.data.page,
        size: result.data.size,
        totalItems: result.data.totalItems,
        totalPages: result.data.totalPages,
        first: result.data.first,
        last: result.data.last,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  useEffect(() => {
    getUnreadCount().then((r) => {
      if (r.success && r.data !== undefined) setUnreadCount(typeof r.data === "number" ? r.data : 0);
    });
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === id ? { ...n, readAt: new Date().toISOString() } : n
      )
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
    );
    setUnreadCount(0);
  };

  const displayLabel = (n: NotificationView) => {
    const msg = typeof n.payload?.message === "string" ? n.payload.message : null;
    return msg || notificationLabel(n.type);
  };

  const filtered = notifications
    .filter((n) => category === "all" || notificationCategory(n.type) === category)
    .filter((n) => (filter === "unread" ? !n.readAt : true));

  const handleArchiveOne = async (id: string) => {
    setArchiving(true);
    const res = await archiveNotification(id);
    setArchiving(false);
    if (res.success) {
      setNotifications((prev) => prev.filter((n) => n.notificationId !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast("Notification archived", "success");
    } else {
      toast(res.message || "Could not archive notification", "error");
    }
  };

  const handleArchiveSelected = async () => {
    if (selectedIds.size === 0) return;
    setArchiving(true);
    const ids = [...selectedIds];
    let failed = 0;
    for (const id of ids) {
      const res = await archiveNotification(id);
      if (!res.success) failed++;
    }
    setArchiving(false);
    setSelectedIds(new Set());
    await fetchPage(page);
    getUnreadCount().then((r) => {
      if (r.success && r.data !== undefined) setUnreadCount(typeof r.data === "number" ? r.data : 0);
    });
    if (failed === 0) toast(`${ids.length} notification(s) archived`, "success");
    else toast(`Archived with ${failed} error(s). Refresh to confirm.`, "error");
  };

  const handleArchiveAllInbox = async () => {
    if (!confirm("Archive all notifications in your inbox? This cannot be undone from the app.")) return;
    setArchiving(true);
    const res = await archiveAllNotifications();
    setArchiving(false);
    if (res.success) {
      await fetchPage(0);
      setPage(0);
      getUnreadCount().then((r) => {
        if (r.success && r.data !== undefined) setUnreadCount(typeof r.data === "number" ? r.data : 0);
      });
      toast("All notifications archived", "success");
    } else {
      toast(res.message || "Could not archive all", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex flex-wrap gap-1 bg-gray-100 rounded-lg p-0.5">
            {(
              [
                ["all", "All"],
                ["rfq", "RFQ"],
                ["opportunity", "Opportunities"],
                ["message", "Messages"],
                ["social", "Social"],
                ["system", "System"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={`px-2.5 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                  category === key
                    ? "bg-white text-gray-900 shadow-sm font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === "all"
                  ? "bg-white text-gray-900 shadow-sm font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All activity
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === "unread"
                  ? "bg-white text-gray-900 shadow-sm font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Unread
            </button>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all read
              </button>
            )}
            {selectedIds.size > 0 && (
              <button
                type="button"
                disabled={archiving}
                onClick={() => void handleArchiveSelected()}
                className="text-sm text-gray-700 hover:text-gray-900 font-medium disabled:opacity-50"
              >
                Archive selected ({selectedIds.size})
              </button>
            )}
            {notifications.length > 0 && (
              <button
                type="button"
                disabled={archiving}
                onClick={() => void handleArchiveAllInbox()}
                className="text-sm text-amber-700 hover:text-amber-900 font-medium disabled:opacity-50"
              >
                Archive all
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg
              className="w-12 h-12 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p className="text-base font-medium">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
            <p className="text-sm mt-1">
              {filter === "unread"
                ? "You're all caught up!"
                : "When you get notifications, they'll show up here."}
            </p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.notificationId}
              className={`flex items-start gap-4 px-5 py-4 border-b border-gray-50 last:border-b-0 transition-colors ${
                !n.readAt ? "bg-blue-50/30" : "hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                className="mt-3 rounded border-gray-300"
                checked={selectedIds.has(n.notificationId)}
                onChange={(e) => {
                  setSelectedIds((prev) => {
                    const next = new Set(prev);
                    if (e.target.checked) next.add(n.notificationId);
                    else next.delete(n.notificationId);
                    return next;
                  });
                }}
                aria-label={`Select notification ${n.notificationId}`}
              />
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconBg(n.type)}`}
              >
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm leading-relaxed ${
                    !n.readAt ? "font-medium text-gray-900" : "text-gray-600"
                  }`}
                >
                  {displayLabel(n)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatTimeAgo(n.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!n.readAt && (
                  <button
                    type="button"
                    onClick={() => handleMarkRead(n.notificationId)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                  >
                    Mark read
                  </button>
                )}
                <button
                  type="button"
                  disabled={archiving}
                  onClick={() => void handleArchiveOne(n.notificationId)}
                  className="text-xs text-gray-500 hover:text-gray-800 whitespace-nowrap disabled:opacity-50"
                >
                  Archive
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {pageData && pageData.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={pageData.first}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {pageData.page + 1} of {pageData.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={pageData.last}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
