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
  fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  fallback?: ReactNode;
}

export const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  className,
  onLoaded,
  onError,
  fallback,
  fit,
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
    <div
      className={cn(
        "relative grid w-full grid-cols-1 grid-rows-1 justify-center self-center",
        className,
      )}
    >
      <Skeleton
        className={cn(
          "z-10 h-auto w-full rounded-none",
          load && !error ? "" : "animate-none opacity-0",
        )}
      />
      {error && <>{fallback ?? <ImageNotFound />}</>}
      <Image
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          load || error ? "opacity-0" : "",
          fit ? "object" + fit : "",
        )}
        alt={alt}
        {...props}
      />
    </div>
  );
};
