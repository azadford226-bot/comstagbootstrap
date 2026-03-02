import FormInput from "@/components/atoms/form_input";
import CompanySizeSelect from "@/components/atoms/company_size_select";
import IndustrySelect from "@/components/atoms/industry_select";
import HashtagSelect from "@/components/atoms/hashtag_select";
import CountryCitySelect from "@/components/molecules/country_city_select";

interface ConsumerStepProps {
  formData: {
    displayName: string;
    industryId: number;
    interests: number[];
    size: string;
    established: string;
    website: string;
    country: string;
    state: string;
    city: string;
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
  };
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onInterestsChange?: (selectedIds: number[]) => void;
}

// Step 1: Organization Information
export function Step1({ formData, onChange, onInterestsChange }: ConsumerStepProps) {
  return (
    <div className="max-w-[646px] mx-auto flex flex-col gap-[27px]">
      <FormInput
        label="Organization Name"
        placeholder="Enter your organization name"
        required
        name="displayName"
        value={formData.displayName}
        onChange={onChange}
      />

      <IndustrySelect
        name="industryId"
        value={formData.industryId}
        onChange={onChange}
        required
      />

      <HashtagSelect
        name="interests"
        value={formData.interests}
        onChange={onInterestsChange || (() => {})}
        required
        label="Interests"
      />

      <div className="grid grid-cols-2 gap-8">
        <CompanySizeSelect
          name="size"
          value={formData.size}
          onChange={onChange}
          required
        />

        <FormInput
          label="Established Date"
          placeholder="YYYY-MM-DD"
          required
          type="date"
          name="established"
          value={formData.established}
          onChange={onChange}
          max={new Date().toISOString().split("T")[0]}
        />
      </div>

      <FormInput
        label="Website"
        placeholder="https://example.com"
        required
        type="url"
        name="website"
        value={formData.website}
        onChange={onChange}
      />

      <CountryCitySelect
        countryValue={formData.country}
        stateValue={formData.state}
        cityValue={formData.city}
        onChange={onChange}
        required
      />
    </div>
  );
}

// Step 2: Account Information
export function Step2({ formData, onChange }: ConsumerStepProps) {
  return (
    <div className="max-w-[646px] mx-auto flex flex-col gap-[27px]">
      <FormInput
        label="Email"
        placeholder="your.email@example.com"
        required
        type="email"
        name="email"
        value={formData.email}
        onChange={onChange}
      />

      <FormInput
        label="Confirm Email"
        placeholder="Confirm your email"
        required
        type="email"
        name="confirmEmail"
        value={formData.confirmEmail}
        onChange={onChange}
      />

      <FormInput
        label="Password"
        placeholder="Enter password (min. 8 characters)"
        required
        type="password"
        name="password"
        value={formData.password}
        onChange={onChange}
      />

      <FormInput
        label="Confirm Password"
        placeholder="Confirm password"
        required
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={onChange}
      />
    </div>
  );
}
