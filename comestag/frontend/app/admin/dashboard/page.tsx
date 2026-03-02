"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  getAdminStats,
  listPendingOrganizations,
  approveOrganization,
  listContactMessages,
  markContactMessageRead,
  type AdminStats,
  type Organization,
  type ContactMessage,
} from "@/lib/api/admin";
import { logger } from "@/lib/logger";
import {
  Building2,
  Users,
  Mail,
  MessageSquare,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Activity,
  AlertCircle,
  Shield,
} from "lucide-react";
import Button from "@/components/atoms/button";
import DevAutoLoginHelper from "@/components/dev-auto-login-helper";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth(true);
  const [activeTab, setActiveTab] = useState<"overview" | "organizations" | "messages">("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingOrgs, setPendingOrgs] = useState<Organization[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && user?.userType !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  // Load dashboard data
  useEffect(() => {
    if (isAuthenticated && user?.userType === "ADMIN") {
      loadDashboardData();
    }
  }, [isAuthenticated, user, activeTab, unreadOnly]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load stats
      const statsData = await getAdminStats();
      if (statsData) {
        setStats(statsData);
      }

      // Load data based on active tab
      if (activeTab === "organizations") {
        const orgsData = await listPendingOrganizations(0);
        setPendingOrgs(orgsData.content || []);
      } else if (activeTab === "messages") {
        const messagesData = await listContactMessages(0, unreadOnly);
        setContactMessages(messagesData.content || []);
      }
    } catch (err) {
      logger.error("Error loading admin dashboard data", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveOrganization = async (orgId: string) => {
    setIsApproving(orgId);
    try {
      const success = await approveOrganization(orgId);
      if (success) {
        // Reload pending organizations
        const orgsData = await listPendingOrganizations(0);
        setPendingOrgs(orgsData.content || []);
        // Reload stats
        const statsData = await getAdminStats();
        if (statsData) {
          setStats(statsData);
        }
      } else {
        setError("Failed to approve organization. Please try again.");
      }
    } catch (err) {
      logger.error("Error approving organization", err);
      setError("Failed to approve organization. Please try again.");
    } finally {
      setIsApproving(null);
    }
  };

  const handleMarkMessageRead = async (messageId: string) => {
    try {
      const success = await markContactMessageRead(messageId);
      if (success) {
        // Update local state
        setContactMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
        );
        // Reload stats
        const statsData = await getAdminStats();
        if (statsData) {
          setStats(statsData);
        }
      }
    } catch (err) {
      logger.error("Error marking message as read", err);
    }
  };

  if (!isAuthenticated || user?.userType !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DevAutoLoginHelper />
      
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <p className="text-gray-600 ml-14">Manage organizations, messages, and platform statistics</p>
            </div>
            <Button
              onClick={loadDashboardData}
              disabled={isLoading}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "overview"
                    ? "border-primary text-primary bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Overview
                </div>
              </button>
              <button
                onClick={() => setActiveTab("organizations")}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "organizations"
                    ? "border-primary text-primary bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Pending Organizations
                  {stats && stats.pendingOrganizations > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {stats.pendingOrganizations}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "messages"
                    ? "border-primary text-primary bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Messages
                  {stats && stats.unreadContactMessages > 0 && (
                    <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {stats.unreadContactMessages}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {isLoading && activeTab === "overview" ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-600 mt-4">Loading dashboard data...</p>
          </div>
        ) : activeTab === "overview" ? (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Organizations"
                value={stats?.totalOrganizations || 0}
                icon={<Building2 className="w-6 h-6" />}
                color="blue"
              />
              <StatCard
                title="Total Consumers"
                value={stats?.totalConsumers || 0}
                icon={<Users className="w-6 h-6" />}
                color="green"
              />
              <StatCard
                title="Pending Approvals"
                value={stats?.pendingOrganizations || 0}
                icon={<Clock className="w-6 h-6" />}
                color="yellow"
                onClick={() => setActiveTab("organizations")}
              />
              <StatCard
                title="Unread Messages"
                value={stats?.unreadContactMessages || 0}
                icon={<Mail className="w-6 h-6" />}
                color="red"
                onClick={() => setActiveTab("messages")}
              />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Admins"
                value={stats?.totalAdmins || 0}
                icon={<Users className="w-6 h-6" />}
                color="purple"
              />
              <StatCard
                title="Total Contact Messages"
                value={stats?.totalContactMessages || 0}
                icon={<Mail className="w-6 h-6" />}
                color="gray"
              />
              <StatCard
                title="Total Conversations"
                value={stats?.totalConversations || 0}
                icon={<MessageSquare className="w-6 h-6" />}
                color="indigo"
              />
            </div>
          </div>
        ) : activeTab === "organizations" ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Pending Organization Approvals
                </h2>
              </div>
              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-gray-600 mt-4">Loading organizations...</p>
                </div>
              ) : pendingOrgs.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No pending organizations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOrgs.map((org) => (
                    <div
                      key={org.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {org.displayName}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            {org.website && (
                              <div className="flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                <a
                                  href={org.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {org.website}
                                </a>
                              </div>
                            )}
                            {org.industry && (
                              <p>
                                <span className="font-medium">Industry:</span> {org.industry.name}
                              </p>
                            )}
                            {org.size && (
                              <p>
                                <span className="font-medium">Size:</span> {org.size}
                              </p>
                            )}
                            {org.established && (
                              <p>
                                <span className="font-medium">Established:</span>{" "}
                                {new Date(org.established).getFullYear()}
                              </p>
                            )}
                            {org.city && (
                              <p>
                                <span className="font-medium">Location:</span> {org.city}
                                {org.state && `, ${org.state}`}
                                {org.country && `, ${org.country}`}
                              </p>
                            )}
                            {org.whoWeAre && (
                              <div className="mt-2">
                                <p className="font-medium mb-1">About:</p>
                                <p className="text-gray-700">{org.whoWeAre}</p>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-3">
                            Registered: {new Date(org.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-4">
                          <Button
                            onClick={() => handleApproveOrganization(org.id)}
                            disabled={isApproving === org.id}
                            className="flex items-center gap-2"
                          >
                            {isApproving === org.id ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Approving...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={unreadOnly}
                    onChange={(e) => setUnreadOnly(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Unread only</span>
                </label>
              </div>
              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-gray-600 mt-4">Loading messages...</p>
                </div>
              ) : contactMessages.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    {unreadOnly ? "No unread messages" : "No contact messages"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contactMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`border rounded-xl p-6 transition-all ${
                        message.read
                          ? "border-gray-200 bg-gray-50"
                          : "border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {message.subject}
                            </h3>
                            {!message.read && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              <span className="font-medium">From:</span> {message.name} (
                              <a
                                href={`mailto:${message.email}`}
                                className="text-primary hover:underline"
                              >
                                {message.email}
                              </a>
                              )
                            </p>
                            <p>
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(message.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {!message.read && (
                          <Button
                            onClick={() => handleMarkMessageRead(message.id)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Mark Read
                          </Button>
                        )}
                        {message.read && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <EyeOff className="w-4 h-4" />
                            Read
                          </div>
                        )}
                      </div>
                      <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                        <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "red" | "purple" | "gray" | "indigo";
  onClick?: () => void;
}

function StatCard({ title, value, icon, color, onClick }: StatCardProps) {
  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
    green: "bg-gradient-to-br from-green-500 to-green-600 text-white",
    yellow: "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white",
    red: "bg-gradient-to-br from-red-500 to-red-600 text-white",
    purple: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
    gray: "bg-gradient-to-br from-gray-500 to-gray-600 text-white",
    indigo: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white",
  };

  const Component = onClick ? "button" : "div";
  const props = onClick ? { onClick, className: "cursor-pointer hover:shadow-xl transition-all transform hover:scale-105" } : {};

  return (
    <Component
      {...props}
      className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 ${onClick ? "hover:shadow-xl transition-all transform hover:scale-105" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className={`${colorClasses[color]} p-4 rounded-xl shadow-lg`}>{icon}</div>
      </div>
    </Component>
  );
}
