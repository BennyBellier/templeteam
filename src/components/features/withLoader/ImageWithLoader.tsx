"use client";

import { ImageNotFound } from "@/components/ui/imageNotFound";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";
import { useState, type ReactNode, type SyntheticEvent } from "react";

export interface ImageWithLoaderProps extends ImageProps {
  className?: string;
  onLoaded?: (e?: SyntheticEvent<HTMLImageElement, Event>) => void;
  onError?: (e?: SyntheticEvent<HTMLImageElement, Event>) => void;
  fallback?: ReactNode;
}

export const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  className,
  onLoaded,
  onError,
  fallback,
  alt,
  ...props
}) => {
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoad(false);
    onLoaded;
  };

  const handleError = () => {
    setError(true);
    onError;
  };

  return (
    <>
      <Skeleton
        className={cn(
          "z-10 col-start-1 col-end-1 row-start-1 row-end-1 rounded-none",
          load && !error ? "" : "animate-none opacity-0",
        )}
      />
      {error && <>{fallback ?? <ImageNotFound />}</>}
      <Image
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "grid col-start-1 col-end-1 row-start-1 row-end-1 overflow-hidden rounded-lg",
          load || error ? "opacity-0" : "",
          className,
        )}
        alt={alt}
        {...props}
      />
    </>
  );
};
