"use client";

import { Typography } from "@/components/ui/typography";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { LayoutSection } from "@/components/layout/layout";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

export function HeroBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <LayoutSection>
      <Typography variant="h1" className="lg:hidden bg-aside-heroBanner text-invert-foreground w-full text-center pt-1 pb-2 xs:text-xl">
        Temple Team
      </Typography>
      <aside className="self-start before:from-aside-heroBanner before:to-aside-heroBanner/0 absolute z-10 lg:flex w-fit items-end -translate-x-64 translate-y-10 text-neutral-50 before:h-[182px] before:w-64 before:-translate-y-[1px] before:translate-x-[2px] before:bg-gradient-to-l before:content-[''] hidden">
        <svg
          viewBox="0 0 409 191"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[200px]"
        >
          <path
            d="M232.169 191L0.7812 190L1.21875 16C207.219 16 318.219 7 408.719 0L362.87 95.5L277.332 99L232.169 191Z"
            fill="#F24150"
          />
        </svg>
        <h2 className="font-display absolute -translate-y-28 translate-x-64 pl-1 text-5xl font-bold">
          TEMPLE TEAM
        </h2>
        <em className="font-display absolute w-64 -translate-y-5 translate-x-64 pl-1 text-xl/10 font-semibold not-italic tracking-[.25rem]">
          {"La Temple Team s'occupe de tout"}
        </em>
      </aside>
      <AspectRatio ratio={16 / 9}>
        <Typography
          variant="h2"
          className={cn(
            "absolute w-full bg-gradient-to-b from-neutral-900/40 to-transparent pb-2 pt-1 text-center text-invert-foreground lg:hidden xs:text-lg"
          )}
        >
          La Temple Team s'occupe de tout
        </Typography>
        {isLoading ? (
          <Skeleton
            className={`h-full w-full rounded-none ${
              isLoading ? "" : " ease opacity-0"
            }`}
          />
        ) : null}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          onCanPlay={() => setIsLoading(false)}
          preload="metadata"
          className={`ease h-fit w-full duration-200 ${
            isLoading ? "opacity-0" : ""
          }`}
        >
          <source src="/video/hero-banner.mp4" type="video/mp4" />
          <source src="/video/hero-banner.mov" type="video/mov" />
          <source src="/video/hero-banner.webm" type="video/webm" />
          <Typography variant="alert" className="flex flex-row gap-2">
            <AlertTriangle /> Votre navigateur ne supporte pas la lecture de
            vidéos !
          </Typography>
        </video>
      </AspectRatio>
    </LayoutSection>
  );
}
