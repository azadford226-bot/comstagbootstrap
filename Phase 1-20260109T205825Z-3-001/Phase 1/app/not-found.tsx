import Link from "next/link";
import Button from "@/components/atoms/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[200px] md:h-[300px] flex flex-col items-center justify-center gap-4 md:gap-6 px-4 py-8 md:py-12">
        <h1 className="text-6xl sm:text-7xl md:text-[120px] font-bold text-white text-center">
          404
        </h1>
        <p className="text-2xl sm:text-3xl md:text-[40px] text-white text-center font-semibold">
          Page Not Found
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24">
        <div className="max-w-[600px] text-center">
          <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
            Oops! This page doesn&apos;t exist
          </h2>
          <p className="text-base md:text-lg text-text-body mb-8 md:mb-12">
            The page you&apos;re looking for might have been removed, had its
            name changed, or is temporarily unavailable.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button type="primary" fullWidth>
                <span className="flex items-center gap-2">← Back to Home</span>
              </Button>
            </Link>
            <Link href="/signup-select">
              <Button type="secondary" fullWidth>
                Create Account
              </Button>
            </Link>
          </div>

          {/* Suggestions
          <div className="mt-12 md:mt-16 pt-8 border-t border-pale-blue">
            <p className="text-sm text-text-body mb-4">
              Here are some helpful links instead:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
              <Link
                href="/"
                className="text-primary-dark hover:text-primary underline"
              >
                Home
              </Link>
              <span className="hidden sm:inline text-pale-blue">•</span>
              <Link
                href="/signup-select"
                className="text-primary-dark hover:text-primary underline"
              >
                Sign Up
              </Link>
              <span className="hidden sm:inline text-pale-blue">•</span>
              <Link
                href="/login"
                className="text-primary-dark hover:text-primary underline"
              >
                Login
              </Link>
              <span className="hidden sm:inline text-pale-blue">•</span>
              <Link
                href="#"
                className="text-primary-dark hover:text-primary underline"
              >
                Contact Us
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
