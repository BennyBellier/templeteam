"use client";

import { EmblaOptionsType } from "embla-carousel";
import Image from "next/image";
import Link from "next/link";
import { LayoutSection } from "../layout/layout";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Typography } from "../ui/typography";
import { useReferences } from "./ReferencesProvider";

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

  console.log("JSX: ", references);

  return (
    <LayoutSection className="gap-5">
      <Typography variant="h1" className="tracking-widest w-fit">
        Ils nous font confiance
      </Typography>
      <Carousel opts={OPTIONS}>
        <CarouselContent className="h-[150px] w-[312px] flex items-center md:w-[624px] lg:w-[936px] pl-2 md:pl-3">
          {references?.map((reference) => (
            <div className="relative px-4 w-fit" key={reference.id}>
              <Link
                href={reference.href ? reference.href : "#"}
                className="group/item ease ease flex h-[100px] w-[280px] cursor-pointer gap-5 rounded-2xl bg-neutral-50 px-4 py-2 shadow-lg transition-transform duration-300 hover:scale-90 dark:bg-neutral-800 dark:shadow-none"
              >
                <Image
                  src={reference.img ? "/img/references/" + reference.img : "/img/references/outsider.jpg"}
                  alt={reference.alt}
                  width={100}
                  height={50}
                  className="self-center object-contain h-14 w-14"
                />
                <span className="self-center font-semibold duration-300 text-md ease group-hover/item:text-red-550">
                  {reference.name}
                </span>
              </Link>
            </div>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </LayoutSection>
  );
};
