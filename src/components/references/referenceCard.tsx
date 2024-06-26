import Link from "next/link";
import { Suspense } from "react";
import { ImageWithLoader } from "../features/withLoader/ImageWithLoader";
import { CarouselItem } from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root"

export type ReferenceCardProps = {
  reference: inferRouterOutputs<AppRouter>["references"]["get"][number];
};

export const ReferenceCard = (props: ReferenceCardProps) => {
  return (
    <CarouselItem className="md:basis-1/2 lg:basis-1/3">
      <Suspense fallback={<Skeleton />}>
        <Link
          href={`/${props.reference.href}`}
          className="group/item ease ease flex h-[100px] w-[280px] cursor-pointer gap-5 rounded-2xl bg-card px-4 py-2 shadow-lg transition-transform duration-300 hover:scale-90 dark:shadow-none"
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
          <span className="text-md ease group-hover/item:text-red-550 flex-1 self-center font-semibold duration-300">
            {props.reference.name}
          </span>
        </Link>
      </Suspense>
    </CarouselItem>
  );
};
