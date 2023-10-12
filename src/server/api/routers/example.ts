import { YoutubeVideos } from './../../../../node_modules/.prisma/client/index.d';
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { env } from "~/env.mjs";
import {
  YOUTUBE_CATEGORY,
  type YOUTUBE_V3_SEARCH,
  type YOUTUBE_V3_VIDEOS,
} from "~/utils/types";
import { prisma } from "~/server/db";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  // revalidation procedure for next/cache
  revalidate: publicProcedure
    .input(z.object({ path: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.path || input.path.length === 0) {
          throw new Error("No path provided");
        }
        console.log("[NextJS] revalidating '", input.path, "'");
        await ctx.res?.revalidate(input.path);
        return { revalidated: true };
      } catch (error) {
        console.log(error);
      }
    }),

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
