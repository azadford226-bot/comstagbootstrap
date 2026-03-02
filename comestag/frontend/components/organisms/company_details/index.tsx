import CompanyDetailsElement from "@/components/molecules/company_details_element";
import React from "react";

function CompanyDetailsSection() {
  return (
    <>
      {/* Our Vision Section */}
      <CompanyDetailsElement title={<>Our Vision</>}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </CompanyDetailsElement>

      {/* Our Mission Section - Right Side */}
      <CompanyDetailsElement title={<>Our Mission</>} alignmentVariant="right">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </CompanyDetailsElement>

      {/* Who we are Section */}
      <CompanyDetailsElement title={<>Who we are ?</>}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </CompanyDetailsElement>
    </>
  );
}

export default CompanyDetailsSection;
