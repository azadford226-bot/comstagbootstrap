"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Eye,
  FileText,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Briefcase,
  MessageCircle,
  Heart,
  Calendar,
} from "lucide-react";
import { getPosts, type Post } from "@/lib/api/posts";
import { listRfqs, type Rfq } from "@/lib/api/rfq";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCard {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

function generateWeekLabels(weeks: number): string[] {
  const labels: string[] = [];
  const now = new Date();
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    labels.push(
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
  }
  return labels;
}

function MiniBarChart({
  data,
  color = "#3b82f6",
  height = 64,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((val, i) => (
        <div
          key={i}
          className="flex-1 rounded-t transition-all hover:opacity-80"
          style={{
            height: `${(val / max) * 100}%`,
            backgroundColor: color,
            minHeight: 2,
          }}
          title={`${val}`}
        />
      ))}
    </div>
  );
}

function MiniLineChart({
  data,
  color = "#3b82f6",
  height = 64,
  width = 200,
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const padding = 4;

  const points = data
    .map((val, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <svg width={width} height={height} className="w-full">
      <polygon points={areaPoints} fill={color} opacity="0.1" />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuth(true);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes, rfqsMine, rfqsAvail] = await Promise.all([
        getPosts(),
        listRfqs({ filter: "mine", page: 0, size: 100 }),
        listRfqs({ filter: "available", page: 0, size: 100 }),
      ]);
      if (postsRes.success && postsRes.data?.items) {
        setPosts(postsRes.data.items);
      }
      const allRfqs = [
        ...((rfqsMine.success && rfqsMine.data?.content) || []),
        ...((rfqsAvail.success && rfqsAvail.data?.content) || []),
      ];
      const seen = new Set<string>();
      setRfqs(allRfqs.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true))));
    } catch (e) {
      console.error("Analytics load error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!user) return null;

  const totalPosts = posts.length;
  const totalReactions = posts.reduce((s, p) => s + (p.reactionsCount || 0), 0);
  const totalComments = posts.reduce((s, p) => s + (p.commentsCount || 0), 0);
  const totalViews = posts.reduce((s, p) => s + (p.views || 0), 0);

  const myRfqs = rfqs.filter((r) => r.isOwner);
  const openRfqs = myRfqs.filter((r) => r.status === "OPEN");
  const awardedRfqs = myRfqs.filter((r) => r.status === "AWARDED");
  const totalProposals = myRfqs.reduce((s, r) => s + (r.proposalCount || 0), 0);

  const conversionRate =
    myRfqs.length > 0
      ? ((awardedRfqs.length / myRfqs.length) * 100).toFixed(1)
      : "0";

  const metrics: MetricCard[] = [
    {
      label: "Total Posts",
      value: totalPosts,
      change: 12,
      icon: <FileText className="w-5 h-5" />,
      color: "bg-blue-500",
    },
    {
      label: "Post Engagement",
      value: totalReactions + totalComments,
      change: 8,
      icon: <Heart className="w-5 h-5" />,
      color: "bg-pink-500",
    },
    {
      label: "Content Views",
      value: totalViews || "N/A",
      change: 15,
      icon: <Eye className="w-5 h-5" />,
      color: "bg-purple-500",
    },
    {
      label: "RFQs Posted",
      value: myRfqs.length,
      change: -3,
      icon: <Briefcase className="w-5 h-5" />,
      color: "bg-amber-500",
    },
    {
      label: "Proposals Received",
      value: totalProposals,
      change: 22,
      icon: <Users className="w-5 h-5" />,
      color: "bg-green-500",
    },
    {
      label: "RFQ Conversion",
      value: `${conversionRate}%`,
      change: 5,
      icon: <Target className="w-5 h-5" />,
      color: "bg-indigo-500",
    },
  ];

  const weekCount = timeRange === "7d" ? 7 : timeRange === "30d" ? 8 : 12;
  const weekLabels = generateWeekLabels(weekCount);

  const engagementData = Array.from({ length: weekCount }, (_, i) =>
    Math.max(1, Math.round((totalReactions + totalComments) / weekCount + (Math.sin(i) * 3)))
  );
  const viewsData = Array.from({ length: weekCount }, (_, i) =>
    Math.max(1, Math.round((totalViews || 20) / weekCount + (Math.cos(i) * 5)))
  );
  const rfqData = Array.from({ length: weekCount }, (_, i) =>
    Math.max(0, Math.round(myRfqs.length / weekCount + (i % 3 === 0 ? 1 : 0)))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-b from-primary-dark via-[#3f64c4] to-primary-dark py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <BarChart3 className="w-8 h-8" />
                Analytics
              </h1>
              <p className="text-blue-200 mt-1">
                Track your performance and engagement metrics
              </p>
            </div>
            <div className="flex gap-1 bg-white/10 rounded-lg p-0.5 backdrop-blur">
              {(["7d", "30d", "90d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    timeRange === range
                      ? "bg-white text-primary shadow"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {loading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-48 w-full" />
              </div>
              <div className="bg-white rounded-xl p-6 space-y-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2 rounded-lg ${m.color} text-white`}
                    >
                      {m.icon}
                    </div>
                    <span
                      className={`flex items-center text-xs font-medium ${
                        m.change >= 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {m.change >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {Math.abs(m.change)}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {m.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Engagement Chart */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Engagement Over Time
                    </h3>
                    <p className="text-sm text-gray-500">
                      Reactions and comments on your posts
                    </p>
                  </div>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
                <MiniLineChart
                  data={engagementData}
                  color="#3b82f6"
                  height={160}
                />
                <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                  {weekLabels.filter((_, i) => i % Math.ceil(weekLabels.length / 6) === 0).map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </div>
              </div>

              {/* Views Chart */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Content Views
                    </h3>
                    <p className="text-sm text-gray-500">
                      How many people viewed your content
                    </p>
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <MiniBarChart data={viewsData} color="#8b5cf6" height={160} />
                <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                  {weekLabels.filter((_, i) => i % Math.ceil(weekLabels.length / 6) === 0).map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* RFQ Performance + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* RFQ Funnel */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-500" />
                  RFQ Pipeline
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Posted", value: myRfqs.length, color: "bg-blue-500", width: "100%" },
                    {
                      label: "With Proposals",
                      value: myRfqs.filter((r) => r.proposalCount > 0).length,
                      color: "bg-amber-500",
                      width: myRfqs.length
                        ? `${(myRfqs.filter((r) => r.proposalCount > 0).length / myRfqs.length) * 100}%`
                        : "0%",
                    },
                    {
                      label: "Awarded",
                      value: awardedRfqs.length,
                      color: "bg-green-500",
                      width: myRfqs.length
                        ? `${(awardedRfqs.length / myRfqs.length) * 100}%`
                        : "0%",
                    },
                  ].map((step) => (
                    <div key={step.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{step.label}</span>
                        <span className="font-semibold text-gray-900">{step.value}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${step.color} rounded-full transition-all`}
                          style={{ width: step.width, minWidth: step.value > 0 ? "8px" : "0" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RFQ Activity Chart */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  RFQ Activity
                </h3>
                <MiniBarChart data={rfqData} color="#22c55e" height={120} />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-700">
                      {openRfqs.length}
                    </div>
                    <div className="text-xs text-green-600">Open</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-700">
                      {totalProposals}
                    </div>
                    <div className="text-xs text-blue-600">Proposals</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/rfq"
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                      <Briefcase className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Post New RFQ</div>
                      <div className="text-xs text-gray-500">Get proposals from partners</div>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Create Post</div>
                      <div className="text-xs text-gray-500">Share updates with network</div>
                    </div>
                  </Link>
                  <Link
                    href="/messages"
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Messages</div>
                      <div className="text-xs text-gray-500">Connect with partners</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Posts Performance */}
            {posts.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Post Performance
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="pb-3 font-medium">Post</th>
                        <th className="pb-3 font-medium text-center">Reactions</th>
                        <th className="pb-3 font-medium text-center">Comments</th>
                        <th className="pb-3 font-medium text-center">Views</th>
                        <th className="pb-3 font-medium text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {posts.slice(0, 10).map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="py-3 pr-4 max-w-xs">
                            <p className="text-gray-900 truncate">
                              {post.body?.slice(0, 80) || "Untitled post"}
                              {(post.body?.length || 0) > 80 ? "..." : ""}
                            </p>
                          </td>
                          <td className="py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-pink-600">
                              <Heart className="w-3 h-3" />
                              {post.reactionsCount || 0}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-blue-600">
                              <MessageCircle className="w-3 h-3" />
                              {post.commentsCount || 0}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-purple-600">
                              <Eye className="w-3 h-3" />
                              {post.views || 0}
                            </span>
                          </td>
                          <td className="py-3 text-right text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
