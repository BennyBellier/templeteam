import type { ReferenceProps, VideoProps, PhotoProps } from "~/utils/types";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import fs from "fs";
import path from "path";
import sizeOf from "image-size";

export const contentRouter = createTRPCRouter({
  references: publicProcedure.query((): ReferenceProps[] => {
    const referencesJSON = fs.readFileSync(
      path.join(process.cwd(), "src", "data", "references.json"),
      "utf8"
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const references: ReferenceProps[] = JSON.parse(referencesJSON);
    return references;
  }),
  videos: publicProcedure.query((): VideoProps[] => {
    const videosJSON = fs.readFileSync(
      path.join(process.cwd(), "src", "data", "videos.json"),
      "utf8"
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const videos: VideoProps[] = JSON.parse(videosJSON);
    videos.map((video) => {
      try {
        const img = sizeOf(
          path.join(
            process.cwd(),
            "public",
            "img",
            "portfolio",
            "thumbnails",
            video.thumbnail
          )
        );
        video.width = img.width!;
        video.height = img.height!;
        return video;
      } catch (error) {
        return video;
      }
    });
    return videos;
  }),

});
