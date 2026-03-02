export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[200px] md:h-[257px] flex flex-col items-center justify-center gap-4 md:gap-[27px] px-4 sm:px-8 md:px-20 lg:px-[303px] py-8 md:py-[47px]">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-white text-center">
          Privacy Policy
        </h1>
        <p className="text-lg sm:text-xl md:text-[24px] text-white text-center">
          Last Updated: November 14, 2025
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              1. Information We Collect
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              We collect information that you provide directly to us when you
              register for an account, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base md:text-lg text-text-body ml-4 mb-4">
              <li>Organization name, industry, and size</li>
              <li>Contact information (email addresses)</li>
              <li>Account administrator details (name, job title, work email)</li>
              <li>Organization description and capabilities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base md:text-lg text-text-body ml-4 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your registration and verify your organization</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>
                Monitor and analyze trends, usage, and activities in connection
                with our services
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              3. Information Sharing and Disclosure
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              We do not share, sell, rent, or trade your personal information with
              third parties for their commercial purposes. We may share your
              information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base md:text-lg text-text-body ml-4 mb-4">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect the rights and safety of ComStag and our users</li>
              <li>In connection with a merger, sale, or acquisition</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              4. Data Security
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              We take reasonable measures to help protect your personal
              information from loss, theft, misuse, unauthorized access,
              disclosure, alteration, and destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              5. Data Retention
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this privacy policy, unless a
              longer retention period is required or permitted by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              6. Your Rights
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base md:text-lg text-text-body ml-4 mb-4">
              <li>Access and receive a copy of your personal information</li>
              <li>Correct inaccurate personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict certain processing of your information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              7. Cookies and Tracking Technologies
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              We use cookies and similar tracking technologies to track activity
              on our service and hold certain information to improve and analyze
              our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              8. Changes to This Privacy Policy
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the &ldquo;Last Updated&rdquo; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              9. Contact Us
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              If you have any questions about this Privacy Policy, please contact
              us at{" "}
              <a
                href="mailto:privacy@comstag.com"
                className="text-secondary hover:text-secondary-light underline"
              >
                privacy@comstag.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
