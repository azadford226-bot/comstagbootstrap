import React from "react";
import { AuthenticatedImage } from "@/components/atoms/authenticated-image";
import { getMediaUrl } from "@/lib/api/media";
import { getInitials } from "@/lib/utils";

interface ProfileImageProps {
  imageId?: string;
  displayName: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-32 h-32 md:w-40 md:h-40",
  lg: "w-40 h-40 md:w-48 md:h-48",
};

const textSizeClasses = {
  sm: "text-xl",
  md: "text-4xl md:text-5xl",
  lg: "text-5xl md:text-6xl",
};

export const ProfileImage: React.FC<ProfileImageProps> = ({
  imageId,
  displayName,
  size = "md",
}) => {
  if (imageId) {
    return (
      <div className={`relative ${sizeClasses[size]}`}>
        <AuthenticatedImage
          src={getMediaUrl(imageId)}
          alt={displayName}
          fill
          className="rounded-full border-4 border-white shadow-lg object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-4 border-white shadow-lg bg-primary flex items-center justify-center`}
    >
      <span className={`${textSizeClasses[size]} text-white font-bold`}>
        {getInitials(displayName)}
      </span>
    </div>
  );
};
