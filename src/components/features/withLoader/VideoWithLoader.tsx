"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import React, { VideoHTMLAttributes, useState } from "react";

export interface VideoWithLoaderProps extends VideoHTMLAttributes<HTMLVideoElement> {
  onLoading?: (value: boolean) => void;
  ratio?: number;
};

export const VideoWithLoader: React.FC<VideoWithLoaderProps> = ({
  children,
  className,
  onLoading,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AspectRatio ratio={props.ratio ? props.ratio : 16 / 9}>
      {isLoading ? (
        <Skeleton
          className={`h-full w-full rounded-none ${
            isLoading ? "" : " ease opacity-0"
          }`}
        />
      ) : null}
      <video
        onCanPlay={() => {
          setIsLoading(false);
          onLoading ? onLoading(true) : null;
        }}
        onError={() => setIsLoading(false)}
        className={cn(
          "ease flex items-center justify-center duration-200",
          className,
          isLoading ? "opacity-0" : "",
        )}
        {...props}
      >
        {children}
      </video>
    </AspectRatio>
  );
};
