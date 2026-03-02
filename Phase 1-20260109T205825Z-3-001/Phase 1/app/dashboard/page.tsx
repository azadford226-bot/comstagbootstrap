"use client";

import { useAuth } from "@/hooks/use-auth";
import Button from "@/components/atoms/button";
import StatCard from "@/components/molecules/stat-card";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth(true);

  if (!user) {
    return null; // useAuth hook handles loading/redirect
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[200px] md:h-[257px] flex flex-col items-center justify-center gap-4 md:gap-[27px] px-4 sm:px-8 md:px-20 lg:px-[303px] py-8 md:py-[47px]">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-white text-center">
          Welcome back, {user.name}!
        </h1>
        <p className="text-3xl sm:text-4xl md:text-[48px] text-white text-center font-['Hubballi']">
          Your Dashboard
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[50px] py-6 md:py-[46px]">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
            label="Profile Status"
            value="Active"
            iconBgColor="bg-primary"
            iconTextColor="text-white"
          />

          <StatCard
            icon={
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
            label="Documents"
            value={0}
            iconBgColor="bg-secondary"
            iconTextColor="text-white"
          />

          <StatCard
            icon={
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            label="Member Since"
            value="Today"
            iconBgColor="bg-primary-light"
            iconTextColor="text-primary"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-primary-dark mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/profile"
              className="border-2 border-light-gray rounded-lg p-6 hover:border-primary transition-colors text-center group"
            >
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                <svg
                  className="w-8 h-8 text-primary group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-primary-dark mb-2">
                View Profile
              </h3>
              <p className="text-sm text-text-body">
                Manage your account details
              </p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-semibold text-primary-dark mb-6">
            Recent Activity
          </h2>
          <div className="border border-light-gray rounded-lg p-8 text-center">
            <svg
              className="w-16 h-16 text-light-gray mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-text-body mb-4">No recent activity yet</p>
            <Button type="primary" href="/under-construction">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
