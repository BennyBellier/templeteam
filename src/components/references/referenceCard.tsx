"use client";

import type { AppRouter } from "@/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import { ImageWithLoader } from "../features/withLoader/ImageWithLoader";
import { memo } from "react";

export type ReferenceCardProps = {
  reference: inferRouterOutputs<AppRouter>["references"]["get"]["items"][number];
};

const ReferenceCard = (props: ReferenceCardProps) => {

  return (
    <Link
      href={`/${props.reference.href}`}
      className="group/item ease flex h-[100px] w-[280px] cursor-pointer gap-5 rounded-xl dark:bg-card px-4 py-2 shadow-lg transition-transform duration-300 hover:scale-90 dark:shadow-none"
      legacyBehavior>
      <div className="relative grid h-14 w-14 grid-cols-1 grid-rows-1 justify-center self-center">
        <ImageWithLoader
          src={
            props.reference.img
              ? "/img/references/" + props.reference.img
              : "/img/references/outsider.jpg"
          }
          alt={props.reference.alt}
          fill
          sizes="56px"
          className="object-contain"
        />
      </div>
      <span className="text-md ease group-hover/item:text-red-550 flex-1 self-center font-semibold capitalize duration-300">
        {props.reference.name}
      </span>
    </Link>
  );
};

export default memo(ReferenceCard)