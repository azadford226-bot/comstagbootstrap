import CompanyDetailsSection from "@/components/organisms/company_details";
import HeroSection from "@/components/organisms/hero-section";
import CTASection from "@/components/organisms/cta-section";
import Button from "@/components/atoms/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      <CompanyDetailsSection />

      {/* View All Partners Button */}
      <section className="pb-12 md:pb-24 px-4">
        <div className="text-center">
          <Button type="partners" href="/under-construction">
            View All Partners →
          </Button>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 md:py-24 px-4 bg-gray-50">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover and join upcoming events, workshops, and networking opportunities
            </p>
          </div>
          <div className="text-center">
            <Button href="/events">
              Browse All Events →
            </Button>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
