import { env } from "@/env.mjs";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";

export const referencesRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        category: z.number().nullable(),
        page: z.number().min(0).prefault(0),
        cursor: z.string().nullish().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { category, page, cursor } = input;
      const take = env.REFERENCE_PAGINATION_SIZE;
      const skip = page * take;

      const items =
        (await ctx.prisma.references.findMany({
          where: {
            ...(category !== null && { categoryId: category }),
          },
          take: take + 1,
          skip,
          cursor: cursor ? { id: cursor } : undefined,
        })) ?? [];

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > take) {
        const nextItem = items.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.references.findMany();
  }),
  getCategory: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.referenceCategory.findMany();
  }),
});
