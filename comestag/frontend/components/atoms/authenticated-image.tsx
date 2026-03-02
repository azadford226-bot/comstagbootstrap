"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getAccessToken } from "@/lib/secure-storage";

interface AuthenticatedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

/**
 * Image component that fetches authenticated images and converts to data URLs
 * This allows loading images that require Authorization headers
 */
export function AuthenticatedImage({
  src,
  alt,
  fill,
  className,
  priority,
  width,
  height,
}: AuthenticatedImageProps) {
  const [dataUrl, setDataUrl] = useState<string>(() => {
    // Initialize state with src if it's already a data URL or external URL
    if (
      src.startsWith("data:") ||
      src.startsWith("http://") ||
      src.startsWith("https://")
    ) {
      return src;
    }
    return "";
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    // Skip fetch if already set in initial state
    if (
      src.startsWith("data:") ||
      src.startsWith("http://") ||
      src.startsWith("https://")
    ) {
      return;
    }

    let isMounted = true;

    const fetchImage = async () => {
      try {
        const token = getAccessToken();
        const response = await fetch(src, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          if (isMounted) setError(true);
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        if (isMounted) setDataUrl(url);

        return url;
      } catch (err) {
        console.error("Failed to load authenticated image:", err);
        if (isMounted) setError(true);
      }
    };

    fetchImage().then((url) => {
      // Cleanup function
      return () => {
        isMounted = false;
        if (url) URL.revokeObjectURL(url);
      };
    });
  }, [src]);

  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${
          className || ""
        }`}
        style={
          fill
            ? { position: "absolute", inset: 0 }
            : !fill && width && height
            ? { width, height }
            : undefined
        }
      >
        <span className="text-gray-400 text-sm">Failed to load</span>
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div
        className={`bg-gray-100 animate-pulse ${className || ""}`}
        style={
          fill
            ? { position: "absolute", inset: 0 }
            : !fill && width && height
            ? { width, height }
            : undefined
        }
      />
    );
  }

  return (
    <Image
      src={dataUrl}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}
