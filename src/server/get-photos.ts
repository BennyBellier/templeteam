import { prisma } from "@/trpc/server";
import { cache } from "react";
import "server-only";

export const preloadAlbums = () => {
  void getPhotos();
};

export const getPhotos = cache(async () => {
  try {
    const photos = await prisma.photos.get();


    console.debug("getPhotos: ", photos);
    return photos;
  } catch (error) {
    console.error({error});
  }
  return [];
});
