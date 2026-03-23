"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
  />
);

export const PostSkeleton: React.FC = () => (
  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
    <div className="flex items-center gap-2">
      <Skeleton className="h-5 w-12 rounded-full" />
      <Skeleton className="h-3 w-20" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-32 flex-1 rounded-lg" />
      <Skeleton className="h-32 flex-1 rounded-lg" />
    </div>
    <div className="flex gap-6 pt-3 border-t border-gray-200">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const RfqCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <Skeleton className="h-5 w-5 shrink-0 ml-4" />
    </div>
  </div>
);

export const ProfileCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <Skeleton className="h-20 w-full rounded-none" />
    <div className="px-4 -mt-12 relative z-10">
      <Skeleton className="w-24 h-24 rounded-full border-4 border-white" />
    </div>
    <div className="px-4 pt-3 pb-4 space-y-2">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-3 w-40" />
      <div className="flex gap-4 pt-3">
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-10 w-16" />
      </div>
    </div>
  </div>
);

export const NotificationSkeleton: React.FC = () => (
  <div className="flex items-start gap-4 px-5 py-4 border-b border-gray-50">
    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div className="lg:col-span-3">
      <ProfileCardSkeleton />
    </div>
    <div className="lg:col-span-6 space-y-4">
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
    <div className="lg:col-span-3 space-y-4">
      <RfqCardSkeleton />
      <RfqCardSkeleton />
    </div>
  </div>
);
