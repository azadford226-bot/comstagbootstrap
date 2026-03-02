import React from "react";
import FormInput from "@/components/atoms/form_input";
import CompanySizeSelect from "@/components/atoms/company_size_select";
import CountryCitySelect from "@/components/molecules/country_city_select";

// Step 1: Organization Details
export function Step1({
  formData,
  onChange,
}: {
  formData: Record<string, string | boolean>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}) {
  return (
    <div className="max-w-[646px] mx-auto">
      <h3 className="text-[24px] font-semibold text-text-dark mb-2">
        Organization Details
      </h3>
      <p className="text-[16px] font-light text-text-dark mb-[75px]">
        Let&apos;s start with your the basics info about the organization
      </p>

      <div className="flex flex-col gap-[27px]">
        <FormInput
          label="Organization Name"
          placeholder="Enter you organization name"
          required
          name="organizationName"
          value={formData.organizationName as string}
          onChange={onChange}
        />

        <FormInput
          label="Industry"
          placeholder="Select your industry"
          required
          name="industry"
          value={formData.industry as string}
          onChange={onChange}
        />

        <CompanySizeSelect
          name="companySize"
          value={formData.companySize as string}
          onChange={onChange}
          required
        />

        <FormInput
          label="Establishment Date"
          placeholder="MM/DD/YYYY"
          type="date"
          name="establishmentDate"
          value={formData.establishmentDate as string}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

// Step 2: Organization Extended Details
export function Step2({
  formData,
  onChange,
}: {
  formData: Record<string, string | boolean>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}) {
  return (
    <div className="max-w-[646px] mx-auto">
      <h3 className="text-[24px] font-semibold text-text-dark mb-2">
        Organization Details
      </h3>
      <p className="text-[16px] font-light text-text-dark mb-[75px]">
        Let&apos;s more about your organization
      </p>

      <div className="flex flex-col gap-[27px]">
        <FormInput
          label="Organization Website"
          placeholder="https//www.example.com"
          required
          type="url"
          name="organizationWebsite"
          value={formData.organizationWebsite as string}
          onChange={onChange}
        />

        <CountryCitySelect
          countryValue={formData.country as string}
          cityValue={formData.city as string}
          onChange={onChange}
          required
        />

        <FormInput
          label="Who we are?"
          placeholder="tell us more in 50 characters about the organization"
          required
          isTextarea
          name="whoWeAre"
          value={formData.whoWeAre as string}
          onChange={onChange}
        />

        <FormInput
          label="what we do ?"
          placeholder="tell us more in 50 characters about the work"
          required
          isTextarea
          name="whatWeDo"
          value={formData.whatWeDo as string}
          onChange={onChange}
        />

        <FormInput
          label="Success Stories"
          placeholder="tell us about the organization success storis"
          required
          isTextarea
          name="successStories"
          value={formData.successStories as string}
          onChange={onChange}
        />

        <FormInput
          label="Our Capabilities"
          placeholder="the capabilities for the organization"
          required
          isTextarea
          name="capabilities"
          value={formData.capabilities as string}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

// Step 3: Email Address & Admin Account
export function Step3({
  formData,
  onChange,
}: {
  formData: Record<string, string | boolean>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}) {
  return (
    <div className="max-w-[646px] mx-auto">
      <h3 className="text-[24px] font-semibold text-text-dark mb-2">
        Email Address
      </h3>
      <p className="text-[16px] font-light text-text-dark mb-[75px]">
        Use your official organization email
      </p>

      <div className="flex flex-col gap-[27px]">
        {/* Note */}
        <div
          className="rounded-[10px] px-5 py-[15px] text-center"
          style={{
            background:
              "linear-gradient(90deg, rgba(255, 255, 255, 0.49) 0%, rgba(255, 255, 255, 0.49) 100%), linear-gradient(90deg, rgba(190, 225, 247, 1) 0%, rgba(190, 225, 247, 1) 100%)",
          }}
        >
          <p className="text-[#303dac]">
            <span className="text-[17px] font-bold">Note</span>
            <span className="text-[15px]">
              : Personal email addresses (Gmail, Yahoo, etc.) are not allowed.
            </span>
          </p>
          <p className="text-[15px] text-[#303dac]">
            Please use your official organization email.
          </p>
        </div>

        <FormInput
          label="Organization Email"
          placeholder="info@yourorg.com"
          required
          type="email"
          name="organizationEmail"
          value={formData.organizationEmail as string}
          onChange={onChange}
        />

        <FormInput
          label="Confirm Email"
          placeholder="Confirm the org email"
          required
          type="email"
          name="confirmEmail"
          value={formData.confirmEmail as string}
          onChange={onChange}
        />

        <div className="border-t border-light-gray">
          <div className="flex flex-col gap-[27px]">
            <FormInput
              label="Password"
              placeholder="Enter password (min. 8 characters)"
              required
              type="password"
              name="password"
              value={formData.password as string}
              onChange={onChange}
            />

            <FormInput
              label="Confirm Password"
              placeholder="Confirm password"
              required
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword as string}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
