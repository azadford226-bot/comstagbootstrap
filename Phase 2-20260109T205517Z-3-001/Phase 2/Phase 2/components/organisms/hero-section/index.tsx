import SearchBar from "@/components/molecules/search_bar";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showSearchBar?: boolean;
  showStats?: boolean;
}

export default function HeroSection({
  title = "Connect with Leading",
  subtitle = "Organizations Worldwide",
  description = "Discover expertise, share success stories, and explore innovation across industries",
  showSearchBar = true,
  showStats = true,
}: HeroSectionProps) {
  return (
    <section className="bg-linear-to-b from-primary-dark via-[#3f64c4] via-50% to-primary-dark relative pt-20 sm:pt-32 md:pt-40 lg:pt-[211px] pb-16">
      <div className="max-w-[1440px] mx-auto px-4 text-center">
        {/* Hero Heading */}
        <div className="flex flex-col items-center gap-2 mb-6 md:mb-10">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[66px] font-bold leading-tight md:leading-normal">
            {title}
          </h2>
          <h2 className="text-secondary-light text-3xl sm:text-4xl md:text-5xl lg:text-[66px] leading-tight md:leading-9 font-bold">
            {subtitle}
          </h2>
        </div>

        {/* Subheading */}
        <p className="text-white text-base md:text-[18px] font-medium leading-normal mb-8 md:mb-[65px] max-w-[606px] mx-auto px-4">
          {description}
        </p>

        {/* Search Bar */}
        {showSearchBar && <SearchBar />}

        {/* Stats */}
        {showStats && (
          <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16 md:gap-32 lg:gap-[286px] text-white text-[20px] font-bold">
            <div className="text-center">
              <p className="text-light-gray">500+</p>
              <p className="text-light-gray">organizations</p>
            </div>
            <div className="text-center">
              <p className="text-light-gray">2000+</p>
              <p className="text-light-gray">Success stories</p>
            </div>
            <div className="text-center">
              <p className="text-light-gray">40+</p>
              <p className="text-light-gray">Industries</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
