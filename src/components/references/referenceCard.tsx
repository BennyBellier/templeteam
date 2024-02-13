import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { CarouselItem } from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";
import type { ReferenceCardProps as ReferenceProps } from "./ReferencesProvider";
import { ImageWithLoader } from "../features/withLoader/ImageWithLoader";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

export type ReferenceCardProps = {
  reference: ReferenceProps;
};

export const ReferenceCard = (props: ReferenceCardProps) => {
  return (
    <CarouselItem className="md:basis-1/2 lg:basis-1/3">
      <Suspense fallback={<Skeleton />}>
        <Link
          href={`/${props.reference.href}`}
          className="group/item ease ease flex h-[100px] w-[280px] cursor-pointer gap-5 rounded-2xl bg-neutral-50 px-4 py-2 shadow-lg transition-transform duration-300 hover:scale-90 dark:bg-neutral-800 dark:shadow-none"
        >
            <ImageWithLoader
              src={
                props.reference.img
                  ? "/img/references/" + props.reference.img
                  : "/img/references/outsider.jpg"
              }
              alt={props.reference.alt}
              fill
              sizes="56px"
              fit="contain"
              className="h-14 w-14 self-center"
            />
          <span className="text-md ease group-hover/item:text-red-550 self-center font-semibold duration-300 flex-1">
            {props.reference.name}
          </span>
        </Link>
      </Suspense>
    </CarouselItem>
  );
};
