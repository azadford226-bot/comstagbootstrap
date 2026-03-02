import Button from "@/components/atoms/button";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CTASection({
  title = "Ready to Showcase Your Organization?",
  description = "Join leading industry organizations and share your success stories with the world.",
  buttonText = "Register your Organization →",
  buttonHref = "/signup-select",
}: CTASectionProps) {
  return (
    <section className="pb-12 md:pb-24 px-4">
      <div className="max-w-[1189px] mx-auto bg-linear-to-r from-primary-dark to-[#3f64c4] rounded-[25px] px-6 sm:px-10 md:px-20 text-center py-12 lg:py-0 lg:h-[290px] flex flex-col justify-center gap-6 md:gap-12">
        <h2 className="text-white text-2xl sm:text-3xl md:text-[36px] font-semibold leading-tight md:leading-normal">
          {title}
        </h2>
        <p className="text-white text-lg sm:text-xl md:text-[24px] font-normal leading-normal">
          {description}
        </p>
        <div className="mx-auto max-w-full">
          <Button type="cta" href={buttonHref}>
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
