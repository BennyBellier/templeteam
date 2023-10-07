import { revalidatePath } from "next/cache";
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

  revalidate: publicProcedure.input(z.object({ path: z.string() })).query(
    ({ input }) => {

      console.log("revalidating path", input.path);
      revalidatePath(input.path);

      return {
        revalidated: true,
        path: input.path,
        date: new Date(),
      };
    }
  ),
});
