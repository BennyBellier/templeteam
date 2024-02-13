"use client";

import { EmblaOptionsType } from "embla-carousel";
import { Suspense, lazy } from "react";
import { LayoutSection } from "../layout/layout";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";
import { Typography } from "../ui/typography";
import { useReferences } from "./ReferencesProvider";
import { ReferenceCard } from "./referenceCard";

const OPTIONS: EmblaOptionsType = {
  loop: true,
  align: "center",
  active: true,
  breakpoints: {
    "(min-width: 768px) and (max-width: 1049px)": { align: "start" },
  },
};

export const References = () => {
  const { references } = useReferences();

  return (
    <LayoutSection className="gap-5">
      <Typography variant="h1" className="w-fit tracking-widest">
        Ils nous font confiance
      </Typography>
      <Carousel
        opts={OPTIONS}
        className="flex h-[150px] w-[312px] items-center md:w-[624px] lg:w-[936px]"
      >
        <CarouselContent className="ml-0.5 flex h-[150px] items-center">
          {references === null ? <Skeleton /> : null}
            {references?.map((reference) => (
              <ReferenceCard key={reference.id} reference={reference} />
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </LayoutSection>
  );
};
