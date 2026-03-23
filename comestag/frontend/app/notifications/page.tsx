"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationView,
  type PageResult,
} from "@/lib/api/notifications";

const TYPE_LABELS: Record<string, string> = {
  RFQ_NEW: "New RFQ posted",
  RFQ_BID: "New bid on your RFQ",
  RFQ_AWARDED: "RFQ awarded",
  RFQ_CLOSED: "RFQ closed",
  MESSAGE_NEW: "New message",
  POST_LIKE: "Liked your post",
  POST_COMMENT: "Commented on your post",
  FOLLOW: "Started following your company",
  SYSTEM: "System notification",
};

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
  if (type.startsWith("RFQ")) return "bg-blue-100 text-blue-600";
  if (type.startsWith("MESSAGE")) return "bg-green-100 text-green-600";
  if (type.startsWith("POST")) return "bg-purple-100 text-purple-600";
  if (type === "FOLLOW") return "bg-amber-100 text-amber-600";
  return "bg-gray-100 text-gray-600";
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationView[]>([]);
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState<Omit<PageResult<NotificationView>, "items"> | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

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
    return msg || TYPE_LABELS[n.type] || n.type;
  };

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.readAt)
      : notifications;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === "all"
                  ? "bg-white text-gray-900 shadow-sm font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All
            </button>
            <button
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
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
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
                    onClick={() => handleMarkRead(n.notificationId)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                  >
                    Mark read
                  </button>
                )}
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
