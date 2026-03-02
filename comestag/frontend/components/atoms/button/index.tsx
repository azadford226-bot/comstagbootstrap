import React from "react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  type?: "primary" | "secondary" | "cta" | "partners";
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  buttonType?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  form?: boolean;
  size?: "default" | "small" | "compact";
  className?: string;
}

function Button({
  children,
  type = "primary",
  href,
  disabled = false,
  onClick,
  buttonType = "button",
  fullWidth = false,
  form = false,
  size = "default",
  className: additionalClassName = "",
}: ButtonProps) {
  const baseStyles =
    "font-bold rounded-[14px] transition-colors inline-flex items-center justify-center";

  const sizeStyles = {
    default: "px-2.5 py-2.5",
    small: "px-4 py-2 text-sm",
    compact: "px-3 py-1.5 text-xs",
  };

  const typeStyles = {
    primary: `bg-primary text-white hover:bg-primary-dark ${
      fullWidth ? "w-full" : size === "default" ? "w-[113px]" : "w-auto"
    } ${form ? "font-bold text-base md:text-lg" : size === "default" ? "text-[15px]" : ""}`,
    secondary: `bg-white text-gray-700 border-2 border-gray-300 hover:border-primary hover:text-primary ${
      fullWidth ? "w-full" : size === "default" ? "w-[113px]" : "w-auto"
    } ${size === "default" ? "text-[14px]" : ""} font-semibold`,
    cta: "bg-accent-light text-text-dark text-lg sm:text-xl md:text-[24px] font-semibold px-4 md:px-[15px] rounded-[20px] w-full sm:w-80 md:w-[405px] hover:bg-accent-dark",
    partners:
      "bg-search-bg text-text-dark text-[24px] font-semibold rounded-[20px] h-[72px] w-[384px] hover:bg-search-bg-hover",
  };

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
  const className = `${baseStyles} ${sizeStyles[size]} ${typeStyles[type]} ${disabledStyles} ${additionalClassName}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      type={buttonType}
    >
      {children}
    </button>
  );
}

export default Button;
