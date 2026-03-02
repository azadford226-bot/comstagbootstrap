import React from "react";

interface CompanySizeSelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

export default function CompanySizeSelect({
  name,
  value,
  onChange,
  required = false,
}: CompanySizeSelectProps) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      <label className="text-[20px] font-semibold text-text-dark">
        Company Size {required && <span>*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark outline-none h-12 appearance-none bg-size-[16px_16px] bg-position-[right_1.25rem_center] bg-no-repeat cursor-pointer"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 16 16%22><path fill=%22%23212529%22 d=%22M4.5 5.5l3.5 3.5 3.5-3.5h-7z%22/></svg>')",
        }}
      >
        <option value="">Select company size</option>
        <option value="1-10">1-10 employees</option>
        <option value="11-50">11-50 employees</option>
        <option value="51-200">51-200 employees</option>
        <option value="201-500">201-500 employees</option>
        <option value="501+">501+ employees</option>
      </select>
    </div>
  );
}
