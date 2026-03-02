"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/atoms/button";

export default function SignupSelectPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[200px] md:h-[257px] flex flex-col items-center justify-center gap-4 md:gap-[27px] px-4 sm:px-8 md:px-20 lg:px-[303px] py-8 md:py-[47px]">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-white text-center">
          Join ComStag
        </h1>
        <p className="text-3xl sm:text-4xl md:text-[48px] text-white text-center font-['Hubballi']">
          Choose Your Account Type
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[50px] py-6 md:py-[46px]">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-[24px] font-semibold text-primary-dark mb-2">
            Create Your Account
          </h2>
          <p className="text-lg md:text-[20px] font-light text-primary-dark">
            Select the type of account you want to create
          </p>
        </div>

        {/* Selection Cards */}
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Supplier/Organization Card */}
          <div
            onClick={() => router.push("/signup")}
            className="border-2 border-light-gray rounded-lg p-8 hover:border-primary transition-colors cursor-pointer"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-primary"
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
              </div>
              <h3 className="text-2xl font-semibold text-primary-dark mb-4">
                Supplier / Organization
              </h3>
              <p className="text-text-body mb-6">
                Register your business to showcase your products and services,
                connect with buyers, and grow your commercial network.
              </p>
              <ul className="text-left text-text-body mb-8 space-y-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Create business profile</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>List products and services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Connect with buyers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Manage capabilities</span>
                </li>
              </ul>
              <Button
                type="primary"
                onClick={() => router.push("/signup")}
                buttonType="button"
                fullWidth
              >
                Register as Supplier
              </Button>
            </div>
          </div>

          {/* Consumer Card */}
          <div
            onClick={() => router.push("/signup-consumer")}
            className="border-2 border-light-gray rounded-lg p-8 hover:border-primary transition-colors cursor-pointer"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-primary"
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
              <h3 className="text-2xl font-semibold text-primary-dark mb-4">
                Consumer
              </h3>
              <p className="text-text-body mb-6">
                Create a personal account to browse products and services,
                connect with suppliers, and discover business opportunities.
              </p>
              <ul className="text-left text-text-body mb-8 space-y-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Browse marketplace</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Connect with suppliers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Save favorites</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Quick registration</span>
                </li>
              </ul>
              <Button
                type="primary"
                onClick={() => router.push("/signup-consumer")}
                buttonType="button"
                fullWidth
              >
                Register as Consumer
              </Button>
            </div>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-12">
          <p className="text-text-body">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary hover:text-primary-dark underline font-medium"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
