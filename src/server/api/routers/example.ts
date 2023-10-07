import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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
});
