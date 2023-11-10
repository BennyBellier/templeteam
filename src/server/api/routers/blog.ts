import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const blogRouter = createTRPCRouter({
  getSortedPosts: publicProcedure.query(async () => {
    const posts = await prisma.blogPosts.findMany({
      orderBy: {
        publishedAt: "desc",
      },
    });
    return posts;
  }),

  getSortedPostsDataByType: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(async ({ input }) => {
      const posts = await prisma.blogPosts.findMany({
        where: input.type === "All" ? {} : { type: input.type },
        orderBy: {
          publishedAt: "desc",
        },
      });
      return posts;
    }),

  getPostData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const post = await prisma.blogPosts.findUnique({
        where: {
          id: input.id,
        },
      });
      return post;
    }),

  getAllPostsId: publicProcedure.query(async () => {
    const posts = await prisma.blogPosts.findMany({
      select: {
        id: true,
      },
    });
    return posts;
  }),

  // TODO: implement addPost: protectedProcedure

  // TODO: implement updatePost: protectedProcedure

  // TODO: implement deletePost: protectedProcedure

  // revalidation protected procedure for next/cache
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
});
