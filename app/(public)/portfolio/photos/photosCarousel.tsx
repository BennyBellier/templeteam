"use client";

import { useCarouselPhotosIdx } from "@/components/Photos/CarouselPhotosProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { Photos } from "@prisma/client";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export type CarouselProps = {
  content: Photos[];
};

export const PhotosCarousel = ({ content, ..._props }: CarouselProps) => {
  const { carouselIdx, setCarouselIdx } = useCarouselPhotosIdx();
  const [api, setApi] = useState<CarouselApi>();
  const isDesktop = useMediaQuery("(min-width: 1050px)");

  useEffect(() => {
    if (!api) {
      return;
    }

    if (carouselIdx !== null) {
      api.scrollTo(carouselIdx, true);
    }
  }, [api, carouselIdx]);

  return (
    <section
      className={cn(
        "absolute left-0 top-0 z-40 flex h-screen w-full items-center justify-center bg-background/30 backdrop-blur-md",
        carouselIdx !== null ? "" : "pointer-events-none opacity-0",
      )}
    >
      <Button
        variant="ghost"
        className="absolute right-5 top-5 hover:bg-transparent"
        onClick={() => {
          setCarouselIdx(null);
          api?.scrollTo(0, true);
        }}
      >
        <X />
      </Button>
      <Carousel setApi={setApi} className="relative flex w-5/6 items-center">
        <CarouselContent>
          {content.map((photo) => (
            <CarouselItem
              key={photo.id}
              className="relative grid basis-full grid-cols-1 grid-rows-1 items-center justify-center overflow-hidden"
            >
              <div className="relative flex self-center justify-self-center">
                <Image
                  src={`/img/portfolio/photos/${photo.src}`}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  className="h-auto lg:h-[83.333333vh] w-auto select-none drop-shadow-2xl aspect-auto"
                />

                <Badge
                  variant="secondary"
                  className={cn(
                    "absolute bottom-2 right-2 col-start-1 col-end-1 row-start-1 row-end-1 self-end justify-self-end drop-shadow-lg",
                    photo.authorLink ? "cursor-pointer" : "cursor-default",
                  )}
                >
                  {photo.authorLink !== null ? (
                    <a href={photo.authorLink ?? ""}>{photo.author}</a>
                  ) : (
                    photo.author
                  )}
                </Badge>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={isDesktop ? "flex" : "hidden"} />
        <CarouselNext className={isDesktop ? "flex" : "hidden"} />
      </Carousel>
    </section>
  );
};
