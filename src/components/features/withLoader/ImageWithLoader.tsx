"use client";

import { ImageNotFound } from "@/components/ui/imageNotFound";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode, useState } from "react";

export interface ImageWithLoaderProps {
  className?: string;
  onLoaded?: (e: any) => void;
  onError?: (e: any) => void;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fit?: string;
  fill?: boolean;
  sizes?: string;
  fallback?: ReactNode;
}

export const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  className,
  onLoaded,
  onError,
  fallback,
  fit,
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
        "relative flex w-full justify-center self-center",
        className,
      )}
    >
      <Skeleton
        className={cn(
          "absolute z-10 h-full w-full rounded-none",
          load && !error ? "" : "animate-none opacity-0",
        )}
      />
      {error && <>{fallback || <ImageNotFound />}</>}
      <Image
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          " h-full w-full",
          load || error ? "opacity-0" : "",
          fit ? "object" + fit : "",
        )}
        {...props}
      />
    </div>
  );
};
