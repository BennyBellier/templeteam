import { prisma } from "@/trpc/server";
import { cache } from "react";
import "server-only";
import { logger } from "./logger";

export const preloadAlbums = () => {
  void getPhotos();
};

export const getPhotos = cache(async () => {
  try {
    const photos = await prisma.photos.get();

    logger.debug("getPhotos: ", photos);
    return photos;
  } catch (error) {
    logger.error(error);
  }
  return [];
});
