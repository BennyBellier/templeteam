"use client";

import { ImageNotFound } from "@/components/ui/imageNotFound";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export type linkProps = {
  src: string | StaticImageData;
  alt: string;
  href: string;
  label: string;
  _className?: string;
};

export const ImageLink = ({ src, alt, href, label, _className }: linkProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-45% 10% -45%" });
  const isDesktop = useMediaQuery("(min-width: 1050px)");
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(false);

  return (
    <Link
      ref={ref}
      href={href}
      className="group relative grid grid-cols-1 grid-rows-1">
      <Skeleton
        className={cn(
          "absolute z-10 h-full w-full rounded-none",
          load && !error ? "" : "animate-none opacity-0",
        )}
      />
      {error && <ImageNotFound />}
      <Image
        src={src}
        alt={alt}
        onLoad={() => setLoad(false)}
        onError={() => setError(true)}
        className={cn(
          "col-start-1 col-end-1 row-start-1 row-end-1 aspect-[3_/_2] w-screen object-cover transition-[filter_500ms_ease] group-hover:brightness-[.7] group-hover:delay-0 md:w-[45vw] lg:h-full",
          !isDesktop && isInView ? "brightness-[.7] delay-0" : "delay-300",
        )}
      />
      <div
        className={cn(
          "ease col-start-1 col-end-1 row-start-1 row-end-1 flex items-center justify-center opacity-0 duration-500 group-hover:opacity-100",
          !isDesktop && isInView ? "opacity-100 " : "",
        )}
      >
        <Typography
          as="h1"
          variant="portfolio"
          className={cn(
            "ease duration-5000 group-hover:scale-105",
            !isDesktop && isInView ? "scale-105" : "",
          )}
        >
          {label}
        </Typography>
      </div>
    </Link>
  );
};
