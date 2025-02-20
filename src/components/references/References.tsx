"use client";

import React from "react";
import type { EmblaOptionsType } from "embla-carousel";
import { LayoutSection } from "../layout/layout";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";
import { Typography } from "../ui/typography";
import ReferenceCard from "./referenceCard";
import { useReferences } from "@/providers/ReferencesProvider";
import { cn } from "@/lib/utils"

const OPTIONS: EmblaOptionsType = {
  loop: true,
  align: "center",
  active: true,
  breakpoints: {
    "(min-width: 768px) and (max-width: 1049px)": { align: "start" },
  },
};

export const References: React.FC = () => {
  const { references, isLoading } = useReferences();

  return (
    <LayoutSection className="gap-5">
      <Typography variant="h1" className="w-fit text-center tracking-widest">
        Ils nous font confiance
      </Typography>
      <Carousel
        opts={OPTIONS}
        className="flex h-[150px] w-[312px] items-center justify-center md:w-[624px] lg:w-[936px]"
      >
        <CarouselContent className="ml-0.5 flex h-[150px] items-center">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <CarouselItem key={i} className="w-fit md:basis-1/2 lg:basis-1/3">
                <Skeleton key={i} className="h-[100px] w-[280px]" />
              </CarouselItem>
            ))}
          {!isLoading && !references && (
            <CarouselItem className="w-fit">
              Aucunes références trouvées.
            </CarouselItem>
          )}
          {references?.map((reference) => (
            <CarouselItem
              key={reference.id}
              className={cn(
                "w-fit",
                references.length === 2 && "md:basis-1/2",
                references.length >= 3 && "lg:basis-1/3",
              )}
            >
              <ReferenceCard reference={reference} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-2 hidden sm:flex" />
        <CarouselNext className="mr-2 hidden sm:flex" />
      </Carousel>
    </LayoutSection>
  );
};
