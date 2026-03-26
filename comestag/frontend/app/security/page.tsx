import Link from "next/link";

export const metadata = {
  title: "Security overview — ComStag",
  description: "How we approach authentication, transport, and data handling.",
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10">
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Product & engineering</p>
          <h1 className="text-2xl font-bold text-primary-dark">Security overview</h1>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            This page summarizes high-level security practices. It is not a legal contract or certification
            statement. For a formal review, contact your account team.
          </p>
        </div>

        <section className="space-y-4 text-sm text-gray-700 leading-relaxed mb-8">
          <h2 className="text-base font-semibold text-gray-900">Authentication and sessions</h2>
          <p>
            User-facing sign-in uses email and password with verification where enabled. API access uses
            bearer tokens with short-lived access tokens and refresh flows. Store tokens only in secure
            client storage; never expose secrets in logs or client bundles.
          </p>
        </section>

        <section className="space-y-4 text-sm text-gray-700 leading-relaxed mb-8">
          <h2 className="text-base font-semibold text-gray-900">Transport and APIs</h2>
          <p>
            Production traffic should use HTTPS end-to-end. CORS is allowlisted per environment; avoid
            wildcard origins when credentials are used. Validate all request inputs on the server.
          </p>
        </section>

        <section className="space-y-4 text-sm text-gray-700 leading-relaxed mb-8">
          <h2 className="text-base font-semibold text-gray-900">Attachments and end-to-end testing</h2>
          <p>
            File uploads are scanned and stored with access controlled by authenticated flows. Optional
            end-to-end tests for attachment uploads and download permissions are planned to reduce
            regression risk in permission checks.
          </p>
        </section>

        <section className="space-y-4 text-sm text-gray-700 leading-relaxed mb-8">
          <h2 className="text-base font-semibold text-gray-900">Operational security</h2>
          <p>
            Secrets belong in environment variables or a managed vault. Rotate database and JWT
            credentials periodically. Monitor for anomalous API usage and failed auth attempts.
          </p>
        </section>

        <p className="text-xs text-gray-500 border-t border-gray-100 pt-6">
          Last updated for internal alignment. For questions, reach your security or platform owner.
        </p>

        <div className="mt-8">
          <Link href="/dashboard" className="text-primary font-medium text-sm hover:underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
