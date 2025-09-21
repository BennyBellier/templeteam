import "server-only";
import { prisma } from "@/trpc/server";
import { cache } from "react";
import logger from "@/server/logger";

export const preloadAlbums = () => {
  void getPhotos();
};

export const getPhotos = cache(async () => {
  try {
    const photos = await prisma.site.photos.get();


    console.debug({
      context: "NextCached",
      requestPath: "getPhotos",
      data: photos,
      message: `Find ${photos.length} photos.`,
    });

    return photos;
  } catch (error) {
    logger.error({
      context: "NextCached",
      requestPath: "getPhotos",
      data: error,
      message: `Error while fetching cached references.`,
    });
  }
  return [];
});
