"use client";

import { Typography } from "@/components/ui/typography";
import { associationPositionToText, cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type PositionProps = {
  index: number;
  position: {
    status: string;
    firstName: string;
    lastName: string;
    picture: string;
  };
};

export default function Position(props: PositionProps) {
  const positionText = associationPositionToText(props.position.status);
  const [imgLoading, setImgLoading] = useState(true);

  return (
    <div
      className={cn(
        "aspect-2/1 flex w-full gap-6",
        props.index % 2 !== 0 ? "" : "flex-row-reverse",
      )}
    >
      <div
        className={cn(
          "aspect-square w-full place-content-center overflow-hidden rounded-lg shadow-md",
          props.position.picture && "relative",
          imgLoading && props.position.picture && "animate-pulse",
        )}
      >
        {props.position.picture ? (
          <Image
            src={`/img/team/${props.position.picture}`}
            alt={`Picture of ${props.position.firstName} ${props.position.lastName}`}
            fill
            sizes="240px"
            onLoad={() => setImgLoading(false)}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff
              strokeWidth={1}
              className="text-muted-foreground sm:size-10 md:size-16"
            />
          </div>
        )}
      </div>
      <div className="flex w-full flex-col items-center justify-center text-center sm:space-y-2">
        <Typography
          as="h1"
          variant="h2"
          className="sm:text-md justify-self-start text-sm font-bold md:tracking-wide"
        >
          {positionText}
        </Typography>
        <Typography as="span" className="text-xs sm:text-base">
          {props.position.firstName} {props.position.lastName}
        </Typography>
      </div>
    </div>
  );
}
