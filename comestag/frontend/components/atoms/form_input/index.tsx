interface FormInputProps {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "date" | "url";
  name?: string;
  value?: string;
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  isTextarea?: boolean;
  rows?: number;
  disabled?: boolean;
  max?: string;
  min?: string;
  maxLength?: number;
}

export default function FormInput({
  label,
  placeholder,
  required = false,
  type = "text",
  name,
  value,
  onChange,
  isTextarea = false,
  rows = 3,
  disabled = false,
  max,
  min,
  maxLength,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      <label className="text-[20px] font-semibold text-text-dark">
        {label} {required && <span>*</span>}
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          disabled={disabled}
          className="bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-text-dark outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          max={max}
          min={min}
          maxLength={maxLength}
          className="bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-text-dark outline-none h-12 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      )}
    </div>
  );
}
