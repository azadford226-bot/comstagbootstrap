import React from "react";
import Logo from "@/components/molecules/logo";

function Footer() {
  return (
    <>
      <footer className="bg-primary-darker text-white py-8 md:py-12 px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row gap-8 mb-8 md:mb-[42px] text-center md:text-left">
            {/* Logo */}
            <div className="md:flex-[1.5] flex justify-center md:justify-start">
              <Logo variant="light" />
            </div>

            {/* Footer Links */}
            <div className="flex-1">
              <h4 className="text-pale-blue text-lg md:text-[20px] font-semibold leading-5 mb-4 md:mb-[26px]">
                Company
              </h4>
              <div className="flex flex-col gap-4 md:gap-6 text-pale-blue text-sm md:text-[16px] font-normal leading-4">
                <a href="/under-construction" className="underline">
                  About us
                </a>
                <a href="/under-construction" className="underline">
                  Our Services
                </a>
                <a href="/privacy" className="underline">
                  Privacy Policy
                </a>
                <a href="/terms" className="underline">
                  Terms & Conditions
                </a>
              </div>
            </div>

            <div className="flex-1">
              <h4 className="text-pale-blue text-lg md:text-[20px] font-semibold leading-5 mb-4 md:mb-[26px]">
                Help
              </h4>
              <div className="flex flex-col gap-4 md:gap-6 text-pale-blue text-sm md:text-[16px] font-normal leading-4">
                <a href="/under-construction" className="underline">
                  Help me
                </a>
                <a href="/under-construction" className="underline">
                  Feedback
                </a>
                <a href="/under-construction" className="underline">
                  Report an Issue / Bug
                </a>
                {/* <a href="/under-construction" className="underline">
                  Lorem Ipsum
                </a> */}
              </div>
            </div>

            {/* <div className="flex-1">
              <h4 className="text-pale-blue text-lg md:text-[20px] font-semibold leading-5 mb-4 md:mb-[26px]">
                Heading
              </h4>
              <div className="flex flex-col gap-4 md:gap-6 text-pale-blue text-sm md:text-[16px] font-normal leading-4">
                <a href="/under-construction" className="underline">
                  Lorem Ipsum
                </a>
                <a href="/under-construction" className="underline">
                  Lorem Ipsum
                </a>
                <a href="/under-construction" className="underline">
                  Lorem Ipsum
                </a>
                <a href="/under-construction" className="underline">
                  Lorem Ipsum
                </a>
                <a href="/under-construction" className="underline">
                  Lorem Ipsum
                </a>
              </div>
            </div> */}
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 md:pt-8 border-t border-[rgba(255,255,255,0.1)]">
            <p className="text-off-white text-xs md:text-[14px] font-normal leading-3.5">
              © 2025 ComStag. All rights reserved.
            </p>
            <div className="flex items-center gap-4 md:gap-6">
              {/* Social icons - placeholder */}
              <div className="w-[37px] h-8 bg-white/10 rounded"></div>
              <div className="w-8 h-8 bg-white/10 rounded"></div>
              <div className="w-[37px] h-[26px] bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
