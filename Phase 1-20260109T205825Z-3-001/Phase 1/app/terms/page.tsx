export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[200px] md:h-[257px] flex flex-col items-center justify-center gap-4 md:gap-[27px] px-4 sm:px-8 md:px-20 lg:px-[303px] py-8 md:py-[47px]">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-white text-center">
          Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              By accessing and using ComStag, you accept and agree to be bound by
              the terms and provision of this agreement. If you do not agree to
              abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              2. Use License
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              Permission is granted to temporarily access the materials
              (information or software) on ComStag for personal, non-commercial
              transitory viewing only.
            </p>
            <p className="text-base md:text-lg text-text-body mb-4">
              This is the grant of a license, not a transfer of title, and under
              this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base md:text-lg text-text-body ml-4 mb-4">
              <li>Modify or copy the materials</li>
              <li>
                Use the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                Attempt to reverse engineer any software contained on ComStag
              </li>
              <li>
                Remove any copyright or other proprietary notations from the
                materials
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              3. Organization Registration
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              Organizations registering on ComStag must provide accurate and
              complete information. All registrations are subject to approval by
              our team to ensure the quality and security of our community.
            </p>
            <p className="text-base md:text-lg text-text-body mb-4">
              We reserve the right to reject any registration or terminate any
              account that violates these terms or provides false information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              4. User Accounts
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You agree to notify us immediately of any unauthorized use
              of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              5. Privacy and Data Protection
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              Your use of ComStag is also governed by our Privacy Policy. We take
              data protection seriously and comply with applicable data protection
              laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              6. Prohibited Activities
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              You agree not to engage in any of the following prohibited
              activities:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base md:text-lg text-text-body ml-4 mb-4">
              <li>Copying, distributing, or disclosing any part of the service</li>
              <li>Using any automated system to access the service</li>
              <li>Transmitting spam, chain letters, or other unsolicited email</li>
              <li>
                Attempting to interfere with, compromise the system integrity or
                security
              </li>
              <li>Collecting or tracking personal information of others</li>
              <li>Impersonating another person or organization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              ComStag shall not be held liable for any damages arising out of or
              in connection with the use or inability to use the service. This is
              a comprehensive limitation of liability that applies to all damages
              of any kind.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              8. Modifications to Terms
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              ComStag reserves the right to revise these terms of service at any
              time without notice. By using this service, you agree to be bound by
              the current version of these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
              9. Contact Information
            </h2>
            <p className="text-base md:text-lg text-text-body mb-4">
              If you have any questions about these Terms of Service, please
              contact us at{" "}
              <a
                href="mailto:legal@comstag.com"
                className="text-secondary hover:text-secondary-light underline"
              >
                legal@comstag.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
