import Link from "next/link";

export const metadata = {
  title: "Help Center | ComStag",
  description:
    "Get help using ComStag — accounts, RFQs, opportunities, messaging, and troubleshooting.",
};

const faqs = [
  {
    q: "How do I create an account?",
    a: "Click Sign Up and choose whether you're registering an organization or a consumer. Organizations are reviewed and approved by our team before they can participate, which keeps the network trustworthy.",
  },
  {
    q: "Why is my organization pending approval?",
    a: "Every organization is verified before it goes live. Approval usually takes a short time — you'll be notified once your account is active. You can check your status from your dashboard.",
  },
  {
    q: "How do RFQs work?",
    a: "Post a Request for Quote describing what you need. Other organizations submit proposals, and you can compare them and award the work to the best fit. Track everything from the RFQ detail page.",
  },
  {
    q: "What are Opportunities?",
    a: "The Opportunities Hub is where organizations post and discover joint ventures, incubation programs, funding rounds, and co-development partnerships. Express interest to start a conversation.",
  },
  {
    q: "How do I message another organization?",
    a: "Open a company's profile and choose Message, or start a new conversation from your inbox. You can share files and schedule meetings directly in the chat.",
  },
  {
    q: "I was signed out unexpectedly.",
    a: "For your security, sessions expire after a period of inactivity. Simply log in again to continue. If the problem persists, clear your browser's site data and sign in fresh.",
  },
  {
    q: "How do I update my profile or upload images?",
    a: "Go to your profile and choose Edit. You can update your details and upload a profile and cover image. Changes are saved to your organization profile.",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[220px] md:h-[300px] flex flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-[52px] font-bold text-white">
          Help Center
        </h1>
        <p className="text-lg md:text-[22px] text-secondary-light font-medium max-w-2xl">
          Answers to common questions, and how to reach us if you need more.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-gray-50 rounded-xl p-6 open:shadow-sm"
            >
              <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-primary-dark list-none">
                {faq.q}
                <span className="ml-4 text-primary-dark transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-text-body">{faq.a}</p>
            </details>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-primary-dark mb-2">
              Still need help?
            </h3>
            <p className="text-text-body mb-4">
              Can&apos;t find what you&apos;re looking for? Send us a message and
              our team will get back to you.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Contact Us
            </Link>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-primary-dark mb-2">
              Found a bug?
            </h3>
            <p className="text-text-body mb-4">
              Let us know what went wrong so we can fix it. Include steps to
              reproduce if you can.
            </p>
            <Link
              href="/report-issue"
              className="inline-block border border-primary-dark text-primary-dark font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark hover:text-white transition-colors"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
