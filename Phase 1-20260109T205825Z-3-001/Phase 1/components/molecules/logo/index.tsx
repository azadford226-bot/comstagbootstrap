import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "default" | "light";
}

function Logo({ variant = "default" }: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-primary-dark";
  const imageFilter = variant === "light" ? "brightness(0) invert(1)" : "";

  return (
    <Link
      href="/"
      className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
    >
      <div className="w-[49px] h-[49px] relative">
        <Image
          src={"/logo/logo.svg"}
          alt={"ComStag Logo"}
          width={49}
          height={49}
          style={{ filter: imageFilter }}
        />
      </div>
      <h1 className={`text-[24px] font-extrabold leading-normal ${textColor}`}>
        ComStag
      </h1>
    </Link>
  );
}

export default Logo;
