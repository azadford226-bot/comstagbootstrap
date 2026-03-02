"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Button from "@/components/atoms/button";
import ChangePasswordModal from "@/components/molecules/change-password-modal";

export default function ProfilePage() {
  const { user, logout } = useAuth(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (!user) {
    return null; // useAuth hook handles loading/redirect
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[200px] md:h-[257px] flex flex-col items-center justify-center gap-4 md:gap-[27px] px-4 sm:px-8 md:px-20 lg:px-[303px] py-8 md:py-[47px]">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-white text-center">
          My Profile
        </h1>
        <p className="text-3xl sm:text-4xl md:text-[48px] text-white text-center font-['Hubballi']">
          Manage Your Account
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[50px] py-6 md:py-[46px]">
        <div className="max-w-[800px] mx-auto">
          {/* Profile Header */}
          <div className="bg-off-white rounded-lg p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <span className="text-3xl text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-primary-dark mb-1">
                  {user.name}
                </h2>
                <p className="text-text-body">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Sections */}
          <div className="space-y-6">
            {/* Account Information */}
            <div className="border border-light-gray rounded-lg p-6">
              <h3 className="text-xl font-semibold text-primary-dark mb-4">
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    Display Name
                  </label>
                  <p className="text-text-body">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    Email Address
                  </label>
                  <p className="text-text-body">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border border-light-gray rounded-lg p-6">
              <h3 className="text-xl font-semibold text-primary-dark mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  disabled
                  className="border border-light-gray rounded-lg p-4 opacity-50 cursor-not-allowed text-left"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-text-dark">Edit Profile</p>
                      <p className="text-sm text-text-body">
                        Update your information
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  disabled
                  className="border border-light-gray rounded-lg p-4 opacity-50 cursor-not-allowed text-left"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-text-dark">
                        Change Password
                      </p>
                      <p className="text-sm text-text-body">
                        Update your password
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  disabled
                  className="border border-light-gray rounded-lg p-4 opacity-50 cursor-not-allowed text-left"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-text-dark">Settings</p>
                      <p className="text-sm text-text-body">
                        Account preferences
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="border border-red-300 rounded-lg p-4 hover:border-red-500 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-red-500">Logout</p>
                      <p className="text-sm text-text-body">
                        Sign out of your account
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Back to Dashboard */}
            <div className="text-center mt-8">
              <Button
                type="primary"
                href="/dashboard"
                buttonType="button"
                fullWidth
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        userEmail={user?.email || ""}
      />
    </div>
  );
}
