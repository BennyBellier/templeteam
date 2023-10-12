import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const videosRouter = createTRPCRouter({
  fetchVideosList: publicProcedure
    .input(
      z.object({
        maxResults: z.number().min(1).max(50).default(20),
        totalResults: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const videos = await prisma.youtubeVideos.findMany({
        orderBy: { publishedAt: "desc" },
        take: input.maxResults,
        skip: input.totalResults,
      });

      const nextTotalResults = input.totalResults + videos.length;

      return {
        videos,
        nextTotalResults: nextTotalResults,
      };
    }),
});