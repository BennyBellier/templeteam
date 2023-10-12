import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const blogRouter = createTRPCRouter({
  // TODO: implement getSortedPosts: publicProcedure

  // TODO: implement getPostData: publicProcedure

  // TODO: implement getAllPostsId: publicProcedure

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