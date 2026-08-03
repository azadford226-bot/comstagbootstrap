import Link from "next/link";

export const metadata = {
  title: "About Us | ComStag",
  description:
    "ComStag is a B2B collaboration platform that connects organizations to discover partners, source suppliers, and grow through real business opportunities.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[220px] md:h-[300px] flex flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-[52px] font-bold text-white">
          About ComStag
        </h1>
        <p className="text-lg md:text-[22px] text-secondary-light font-medium max-w-2xl">
          The B2B network where organizations find the right partners and turn
          connections into real business.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <section className="mb-12">
          <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
            Our Mission
          </h2>
          <p className="text-base md:text-lg text-text-body mb-4">
            ComStag exists to make business collaboration effortless. We help
            organizations discover one another, evaluate capabilities, and start
            working together — whether that means sourcing a supplier, responding
            to a request for quote, launching a joint venture, or hiring a partner
            for a project.
          </p>
          <p className="text-base md:text-lg text-text-body">
            Every company on ComStag is verified and approved before it can
            participate, so the network stays trustworthy and every connection is
            a real one.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
            What We Do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-primary-dark mb-2">
                Discover organizations
              </h3>
              <p className="text-text-body">
                Search a curated directory of verified companies by industry,
                capability, and location.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-primary-dark mb-2">
                Source &amp; sell with RFQs
              </h3>
              <p className="text-text-body">
                Post requests for quote, receive proposals, and award work — all
                in one place.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-primary-dark mb-2">
                Explore opportunities
              </h3>
              <p className="text-text-body">
                Find joint ventures, incubation programs, funding rounds, and
                co-development partnerships.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-primary-dark mb-2">
                Connect directly
              </h3>
              <p className="text-text-body">
                Message partners, share files, and schedule meetings without
                leaving the platform.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-4">
            Who It&apos;s For
          </h2>
          <p className="text-base md:text-lg text-text-body">
            ComStag is built for organizations of every size — from startups
            looking for their first partners to established enterprises expanding
            their supplier and collaboration networks.
          </p>
        </section>

        {/* CTA */}
        <div className="bg-primary-dark rounded-2xl px-6 py-10 text-center">
          <h2 className="text-2xl md:text-[28px] font-semibold text-white mb-3">
            Ready to grow your network?
          </h2>
          <p className="text-secondary-light mb-6">
            Join ComStag and start connecting with verified organizations today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup-select"
              className="inline-block bg-white text-primary-dark font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/contact"
              className="inline-block border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
