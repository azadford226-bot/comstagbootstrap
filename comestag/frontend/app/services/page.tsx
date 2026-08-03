import Link from "next/link";

export const metadata = {
  title: "Our Services | ComStag",
  description:
    "Explore what ComStag offers: a verified company directory, RFQs, an opportunities hub, direct messaging, events, and analytics.",
};

const services = [
  {
    title: "Company Directory & Profiles",
    description:
      "Build a rich organization profile and get discovered. Search verified companies by industry, capability, size, and location.",
    href: "/dashboard",
  },
  {
    title: "Requests for Quote (RFQs)",
    description:
      "Post RFQs to source products and services, receive competitive proposals, and award the best partner — with a full status tracker.",
    href: "/rfq",
  },
  {
    title: "Opportunities Hub",
    description:
      "Discover and post joint ventures, incubation programs, funding rounds, and co-development partnerships that fit your goals.",
    href: "/opportunities",
  },
  {
    title: "Direct Messaging",
    description:
      "Connect with partners in real time. Share files, exchange details, and keep every conversation in one secure inbox.",
    href: "/messages",
  },
  {
    title: "Events",
    description:
      "Host and join online or in-person events. Manage registrations and grow your presence across the network.",
    href: "/events",
  },
  {
    title: "Analytics",
    description:
      "Track profile activity, RFQ performance, and engagement trends to understand what's working and where to focus.",
    href: "/analytics",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[220px] md:h-[300px] flex flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-[52px] font-bold text-white">
          Our Services
        </h1>
        <p className="text-lg md:text-[22px] text-secondary-light font-medium max-w-2xl">
          Everything your organization needs to find partners, win work, and grow
          — in one platform.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group bg-gray-50 p-6 rounded-xl border border-transparent hover:border-primary-dark hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-semibold text-primary-dark mb-2 group-hover:underline">
                {service.title}
              </h3>
              <p className="text-text-body">{service.description}</p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-primary-dark rounded-2xl px-6 py-10 text-center">
          <h2 className="text-2xl md:text-[28px] font-semibold text-white mb-3">
            See it in action
          </h2>
          <p className="text-secondary-light mb-6">
            Create your organization profile and start using every feature today.
          </p>
          <Link
            href="/signup-select"
            className="inline-block bg-white text-primary-dark font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
