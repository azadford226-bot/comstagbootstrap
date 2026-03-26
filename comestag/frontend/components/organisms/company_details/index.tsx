import CompanyDetailsElement from "@/components/molecules/company_details_element";
import React from "react";

function CompanyDetailsSection() {
  return (
    <>
      <CompanyDetailsElement title={<>Our Vision</>}>
        Comstag connects organizations across industries so buyers, vendors, startups, and investors
        can discover each other, run structured sourcing, and build partnerships—without being tied to
        a single software stack or geography.
      </CompanyDetailsElement>

      <CompanyDetailsElement title={<>Our Mission</>} alignmentVariant="right">
        We focus on clarity and trust: verified organizations, transparent opportunities, and tools
        that help teams move from introduction to collaboration with less friction—whether you are
        procuring solutions, forming a joint venture, or exploring funding.
      </CompanyDetailsElement>

      <CompanyDetailsElement title={<>Who we are</>}>
        We are building a neutral collaboration layer for B2B relationships—combining network
        discovery with RFQs, messaging, and opportunities so your team spends less time on admin
        handoffs and more time on outcomes that matter to your business.
      </CompanyDetailsElement>
    </>
  );
}

export default CompanyDetailsSection;
