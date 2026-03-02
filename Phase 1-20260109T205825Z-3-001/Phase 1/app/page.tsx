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

      <CTASection />
    </div>
  );
}
