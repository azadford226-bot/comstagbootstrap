import React from "react";
import { AuthenticatedImage } from "@/components/atoms/authenticated-image";
import { getMediaUrl } from "@/lib/api/media";

interface CoverImageProps {
  imageId?: string;
  alt?: string;
}

export const CoverImage: React.FC<CoverImageProps> = ({
  imageId,
  alt = "Cover",
}) => {
  return (
    <div className="relative h-64 md:h-80 bg-linear-to-r from-primary-dark via-primary to-primary-dark">
      {imageId && (
        <AuthenticatedImage
          src={getMediaUrl(imageId)}
          alt={alt}
          fill
          className="object-cover"
          priority
        />
      )}
    </div>
  );
};
