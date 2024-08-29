"use client";

import { useCarouselPhotosIdx } from "@/components/Photos/CarouselPhotosProvider";
import { ImageWithLoader } from "@/components/features/withLoader/ImageWithLoader";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { Photos as PhotosType } from "@prisma/client";

export type PhotosArrayProps = {
  photos: PhotosType[];
};

export const Photos = ({ photos, ..._props }: PhotosArrayProps) => {
  const { setCarouselIdx } = useCarouselPhotosIdx();

  if (photos.length === 0) {
    return (
      <Typography as="h1" variant="lead">
        Aucune photo n&apos;est disponible pour le moment !
      </Typography>
    );
  }

  return (
    <>
      {photos.map((photo, index) => (
        <li
          key={photo.id}
          className="group relative grid grid-cols-1 grid-rows-1 justify-center self-center overflow-hidden rounded-lg hover:cursor-zoom-in"
          onClick={() => setCarouselIdx(index)}
        >
          <ImageWithLoader
            src={`/img/portfolio/photos/${photo.src}`}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className={cn("1050:h-80 w-auto md:h-80")}
          />

          <Badge
            variant="secondary"
            className={cn(
              "absolute bottom-2 right-2 col-start-1 col-end-1 row-start-1 row-end-1 self-end justify-self-end drop-shadow-lg",
              photo.authorLink ? "cursor-pointer" : "cursor-default",
            )}
          >
            {photo.authorLink ? (
              <a
                href={photo.authorLink ?? ""}
                className={cn(photo.authorLink ? "cursor-pointer" : "")}
              >
                {photo.author}
              </a>
            ) : (
              photo.author
            )}
          </Badge>
        </li>
      ))}
    </>
  );
};
