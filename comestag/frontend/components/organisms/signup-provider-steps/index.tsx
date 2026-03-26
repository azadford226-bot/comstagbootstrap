"use client";

import React from "react";
import FormInput from "@/components/atoms/form_input";
import CompanySizeSelect from "@/components/atoms/company_size_select";
import IndustrySelect from "@/components/atoms/industry_select";
import CountryCitySelect from "@/components/molecules/country_city_select";
import { CAPABILITY_TAGS } from "@/lib/capability-tags";

// Step 1: Organization Details
export function Step1({
  formData,
  onChange,
}: {
  formData: Record<string, string | boolean | number>;
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
          placeholder="Enter your organization name"
          required
          name="organizationName"
          value={formData.organizationName as string}
          onChange={onChange}
        />

        <div>
          <label className="block text-[16px] font-medium text-text-dark mb-2">
            Company Type <span className="text-red-500">*</span>
          </label>
          <select
            name="companyType"
            value={formData.companyType as string}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-[#e3e3e3] rounded-[10px] text-[16px] text-text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Select your company type</option>
            <option value="ENTERPRISE">Enterprise / Corporation</option>
            <option value="VENDOR">Software Vendor / Supplier</option>
            <option value="STARTUP">Startup</option>
            <option value="INVESTOR">Investor / VC / Accelerator</option>
            <option value="SERVICE_PROVIDER">Service Provider / Consultancy</option>
          </select>
        </div>

        <IndustrySelect
          name="industryId"
          value={formData.industryId as number}
          onChange={onChange}
          required
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
          max={new Date().toISOString().split('T')[0]}
        />

        <FormInput
          label="Tech Stack & Capabilities"
          placeholder="e.g. React, Java, AWS, Docker (comma-separated)"
          name="techStack"
          value={formData.techStack as string}
          onChange={onChange}
        />
        <div>
          <p className="text-sm font-medium text-text-dark mb-2">Curated capability tags</p>
          <p className="text-xs text-gray-500 mb-2">Pick standard tags for better matching; you can still type custom skills above.</p>
          <div className="flex flex-wrap gap-2">
            {CAPABILITY_TAGS.map((t) => {
              const current = ((formData.techStack as string) || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              const active = current.includes(t.label);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    const set = new Set(current);
                    if (active) set.delete(t.label);
                    else set.add(t.label);
                    const value = [...set].join(", ");
                    onChange({
                      target: { name: "techStack", value },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    active
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary/40"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Organization Extended Details
export function Step2({
  formData,
  onChange,
}: {
  formData: Record<string, string | boolean | number>;
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
          stateValue={formData.state as string}
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
      </div>
    </div>
  );
}

// Step 3: Email Address & Admin Account
export function Step3({
  formData,
  onChange,
}: {
  formData: Record<string, string | boolean | number>;
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
