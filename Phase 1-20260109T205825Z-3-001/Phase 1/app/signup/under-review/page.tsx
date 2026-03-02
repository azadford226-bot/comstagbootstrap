import Link from "next/link";

export default function UnderReviewPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[200px] md:h-[257px] flex flex-col items-center justify-center gap-4 md:gap-[27px] px-4 sm:px-8 md:px-20 lg:px-[303px] py-8 md:py-[47px]">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-white text-center">
          Welcome to ComStag
        </h1>
        <p className="text-3xl sm:text-4xl md:text-[48px] text-white text-center font-['Hubballi']">
          Connect. Collaborate. Succeed.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center space-y-8 md:space-y-12">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-secondary/10 flex items-center justify-center">
              <svg
                className="w-12 h-12 md:w-16 md:h-16 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-primary-dark">
              Thank You for Registering!
            </h2>
            <p className="text-lg sm:text-xl md:text-[24px] text-text-body max-w-2xl mx-auto">
              Your request is currently under review
            </p>
          </div>

          {/* Information Box */}
          <div className="bg-pale-blue/20 border border-pale-blue rounded-[15px] p-6 md:p-8 max-w-2xl mx-auto">
            <div className="space-y-4 text-left">
              <div className="bg-accent-light/30 border border-accent rounded-[10px] p-4 mb-4">
                <p className="text-base md:text-lg text-primary-dark font-semibold">
                  📧 Verification Email Sent!
                </p>
                <p className="text-sm md:text-base text-text-dark mt-2">
                  Please check your email and click the verification link to
                  activate your account.
                </p>
              </div>
              <p className="text-base md:text-lg text-text-dark">
                We&apos;re reviewing your organization&apos;s information to
                ensure the quality and security of our community.
              </p>
              <p className="text-base md:text-lg text-text-dark">
                You will receive an email notification once your account has
                been approved. This typically takes 1-2 business days.
              </p>
              <p className="text-base md:text-lg text-text-dark font-medium">
                What happens next:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base md:text-lg text-text-dark ml-4">
                <li>Verify your email address by clicking the link sent to you</li>
                <li>Our team will verify your organization details</li>
                <li>You&apos;ll receive an email confirmation upon approval</li>
                <li>You can then log in and start using ComStag</li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="pt-8 border-t border-pale-blue max-w-2xl mx-auto">
            <p className="text-base md:text-lg text-text-body">
              Have questions? Contact us at{" "}
              <a
                href="mailto:support@comstag.com"
                className="text-secondary hover:text-secondary-light underline"
              >
                support@comstag.com
              </a>
            </p>
          </div>

          {/* Back to Home Button */}
          <div className="pt-4">
            <Link
              href="/"
              className="inline-block bg-secondary hover:bg-secondary-light text-white text-base md:text-lg font-medium px-8 py-3 rounded-[10px] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
