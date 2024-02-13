"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { VideoNotFound } from "@/components/ui/videoNotFound";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import React, { ReactNode, VideoHTMLAttributes, useEffect, useRef, useState } from "react";

export interface VideoWithLoaderProps
  extends VideoHTMLAttributes<HTMLVideoElement> {
  onLoaded?: (e: any) => void;
  fallback?: ReactNode;
  ratio?: number;
}

export const VideoWithLoader: React.FC<VideoWithLoaderProps> = ({
  children,
  className,
  onLoaded,
  fallback,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCanPlay = () => {
    setIsLoading(false);
    onLoaded;
  };

  useEffect(() => {
    if (videoRef.current?.readyState! === 0) {
      setError(true);
    }

  }, [videoRef.current?.readyState])

  return (
    <AspectRatio ratio={props.ratio ? props.ratio : 16 / 9}>
      <Skeleton
        className={cn(
          "absolute h-full w-full rounded-none",
          isLoading && !error ? "" : "animate-none opacity-0",
        )}
      />
      {error && <>{fallback || <VideoNotFound />}</>}
      <video
        ref={videoRef}
        onCanPlay={handleCanPlay}
        className={cn(
          "ease flex items-center justify-center duration-200",
          className,
          isLoading || error ? "opacity-0" : "",
        )}
        {...props}
      >
        {children}
      </video>
    </AspectRatio>
  );
};
