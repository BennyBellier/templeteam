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
        maxResults: z.number().min(1).max(50).nullish(),
        publishedBefore: z.string().nullish().default(new Date().toISOString()),
        totalResults: z.number().nullish().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const maxResults = input.maxResults ?? 20;

      const responseSearch = await fetch(
        `https://www.googleapis.com/youtube/v3/search?channelId=${env.YOUTUBE_CHANNEL_ID}&publishedBefore=${input.publishedBefore}&maxResults=${maxResults}&order=date&type=video&key=${env.YOUTUBE_API_KEY}`
      );

      if (!responseSearch.ok) {
        const errorData = await responseSearch.json() as { error?: { message?: string } };
        const errorMessage = errorData?.error?.message ?? "Unknown error";
        throw new Error(`YOUTUBE SEARCH QUERY] Error fetching data: ${responseSearch.status} ${responseSearch.statusText} : ${errorMessage}`);
      }

      const searchData = await responseSearch.json() as YOUTUBE_V3_SEARCH;

      const videosId = searchData.items.map(
        (item: { id: { videoId: string } }) => {
          return item.id.videoId;
        }
      );

      const responseVideos = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videosId.join(
          ","
        )}&key=${process.env.YOUTUBE_API_KEY}`
      );

      if (!responseVideos.ok) {
        const errorData = (await responseVideos.json()) as {
          error?: { message?: string };
        };
        const errorMessage = errorData?.error?.message ?? "Unknown error";
        console.error(
          `YOUTUBE VIDEO QUERY] Error fetching data: ${responseVideos.status} ${responseVideos.statusText} : ${errorMessage}`
        );
      }

      const data = (await responseVideos.json()) as YOUTUBE_V3_VIDEOS;

      const videos = data.items.map((item) => {
        return {
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high.url,
          category: YOUTUBE_CATEGORY[item.snippet.categoryId],
        };
      });

      const nextTotalResults =
        input.totalResults! + data.pageInfo.resultsPerPage;
      let nextPublishBefore: string | undefined = undefined;
      if (nextTotalResults < data.pageInfo.totalResults) {
        nextPublishBefore =
          data.items[data.items.length - 1]!.snippet.publishedAt;
      }

      return {
        videos,
        nextPublishedBefore: nextPublishBefore,
        nextTotalResults: nextTotalResults,
      };
    }),
});
