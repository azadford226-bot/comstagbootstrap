import Link from "next/link";
import Button from "@/components/atoms/button";

export default function UnderConstruction() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[250px] md:h-[350px] flex flex-col items-center justify-center gap-4 md:gap-6 px-4 py-8 md:py-12">
        <div className="text-center">
          {/* Construction Icon */}
          <div className="mb-6 flex justify-center">
            <svg
              className="w-20 h-20 md:w-32 md:h-32 text-secondary-light"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[56px] font-bold text-white text-center mb-2">
            Under Construction
          </h1>
          <p className="text-xl sm:text-2xl md:text-[32px] text-secondary-light text-center font-semibold">
            We&apos;re Building Something Great
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24">
        <div className="max-w-[700px] text-center">
          <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
            This Feature is Coming Soon
          </h2>
          <p className="text-base md:text-lg text-text-body mb-8 md:mb-12">
            We&apos;re working hard to bring you this feature. Our team is
            crafting an amazing experience that will be worth the wait. Check
            back soon!
          </p>

          {/* Progress Indicators */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center text-sm md:text-base">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-text-body">In Development</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-text-body">Testing Phase</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pale-blue rounded-full"></div>
                <span className="text-text-body">Launch Ready</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/">
              <Button type="primary" fullWidth>
                <span className="flex items-center gap-2">← Back to Home</span>
              </Button>
            </Link>
            <Link href="/signup-select">
              <Button type="secondary" fullWidth>
                Get Started
              </Button>
            </Link>
          </div>

          {/* Stay Updated Section */}
          <div className="mt-12 md:mt-16 pt-8 border-t border-pale-blue">
            <h3 className="text-lg md:text-xl font-semibold text-primary-dark mb-4">
              Stay Updated
            </h3>
            <p className="text-sm md:text-base text-text-body mb-6">
              Want to be notified when this feature launches? Create an account
              to receive updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup-select"
                className="text-primary-dark hover:text-primary font-medium underline"
              >
                Create Account
              </Link>
              <span className="hidden sm:inline text-pale-blue">•</span>
              <Link
                href="#"
                className="text-primary-dark hover:text-primary font-medium underline"
              >
                Subscribe to Updates
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
