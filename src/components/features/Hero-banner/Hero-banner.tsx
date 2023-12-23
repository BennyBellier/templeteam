"use client";

import { Typography } from "@/components/ui/typography";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useState } from "react";

export function HeroBanner() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex items-center justify-center">
      <AspectRatio ratio={16 / 9} className="w-full">
        {isLoading && <Skeleton className="w-full h-full" />}
        {!isLoading && (
          <video
            autoPlay
            loop
            muted
            preload="none"
            onLoadedData={() => setIsLoading(false)}
          >
            <source
              src="https://templeteam.fr/static/video/hero-banner.mp4"
              type="video/mp4"
            />
            <source
              src="https://templeteam.fr/static/video/hero-banner.mov"
              type="video/mov"
            />
            <source
              src="https://templeteam.fr/static/video/hero-banner.webm"
              type="video/webm"
            />
            <Typography variant="alert" className="flex flex-row gap-2">
              <AlertTriangle /> Votre navigateur ne supporte pas la lecture de
              vidéos !
            </Typography>
          </video>
        )}
      </AspectRatio>
    </div>
  );
}
