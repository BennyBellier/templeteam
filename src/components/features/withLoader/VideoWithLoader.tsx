"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { VideoNotFound } from "@/components/ui/videoNotFound";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import React, {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type SyntheticEvent,
  type VideoHTMLAttributes,
} from "react";

export interface VideoWithLoaderProps
  extends VideoHTMLAttributes<HTMLVideoElement> {
  onLoaded?: (e?: SyntheticEvent<HTMLVideoElement, Event>) => void;
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

  const handleCanPlay = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
    setIsLoading(false);
    if (onLoaded) onLoaded(e);
  };

  useEffect(() => {
    if (videoRef.current?.readyState === 0) {
      setError(true);
    }

    if (videoRef.current?.readyState && videoRef.current?.readyState >= 2) {
      setError(false);
      setIsLoading(false);
      onLoaded;
    }
  }, [onLoaded, videoRef.current?.readyState]);

  return (
    <AspectRatio ratio={props.ratio ? props.ratio : 16 / 9}>
      <Skeleton
        className={cn(
          "absolute h-full w-full rounded-none",
          isLoading && !error ? "" : "animate-none opacity-0",
        )}
      />
      {error && <>{fallback ?? <VideoNotFound />}</>}
      <video
        ref={videoRef}
        onCanPlay={(e) => handleCanPlay(e)}
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
