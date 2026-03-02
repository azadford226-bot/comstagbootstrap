"use client";

import React, { useState, useEffect } from "react";
import { fetchDynamicData, Industry } from "@/lib/locations";

interface IndustrySelectProps {
  name?: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

export default function IndustrySelect({
  name = "industryId",
  value,
  onChange,
  required = false,
}: IndustrySelectProps) {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadIndustries = async () => {
      setIsLoading(true);
      const data = await fetchDynamicData();
      setIndustries(data.industries);
      setIsLoading(false);
    };
    loadIndustries();
  }, []);

  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[20px] font-semibold text-text-dark">
        Industry {required && <span>*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={isLoading}
        className="bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark outline-none h-12 appearance-none bg-size-[16px_16px] bg-position-[right_1.25rem_center] bg-no-repeat cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 16 16%22><path fill=%22%23212529%22 d=%22M4.5 5.5l3.5 3.5 3.5-3.5h-7z%22/></svg>')",
        }}
      >
        <option value="">
          {isLoading ? "Loading industries..." : "Select your industry"}
        </option>
        {industries.map((industry) => (
          <option key={industry.id} value={industry.id}>
            {industry.name}
          </option>
        ))}
      </select>
    </div>
  );
}
