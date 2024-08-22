"use client";

import { useReferencesStore } from "@/stores/referencesStore";
import type { EmblaOptionsType } from "embla-carousel";
import { useShallow } from "zustand/react/shallow";
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
import { ReferenceCard } from "./referenceCard";

const OPTIONS: EmblaOptionsType = {
  loop: true,
  align: "center",
  active: true,
  breakpoints: {
    "(min-width: 768px) and (max-width: 1049px)": { align: "start" },
  },
};

export function References() {
  const references = useReferencesStore(
    useShallow((state) => state.references),
  );

  const isInitialized = useReferencesStore(
    useShallow((state) => state.isInitialized),
  );

  return (
    <LayoutSection className="gap-5">
      <Typography variant="h1" className="w-fit text-center tracking-widest">
        Ils nous font confiance
      </Typography>
      <Carousel
        opts={OPTIONS}
        className="flex h-[150px] w-[312px] items-center md:w-[624px] lg:w-[936px]"
      >
        <CarouselContent className="ml-0.5 flex h-[150px] items-center">
          {!isInitialized ? <Skeleton /> : null}
          {references?.map((reference) => (
            <CarouselItem
              key={reference.id}
              className="w-fit md:basis-1/2 lg:basis-1/3"
            >
              <ReferenceCard reference={reference} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-2" />
        <CarouselNext className="mr-2" />
      </Carousel>
    </LayoutSection>
  );
}
