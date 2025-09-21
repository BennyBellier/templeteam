import { env } from "@/env.mjs";
import { BlogCategory } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const CategoryEnum = z.nativeEnum(BlogCategory);
export type CategoryEnum = z.infer<typeof CategoryEnum>;

export const blogPostsRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        category: CategoryEnum.optional(),
        page: z.number().min(0).default(0),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { category, page, cursor } = input;
      const take = env.BLOG_PAGINATION_SIZE;
      const skip = page * take;

      const items =
        (await ctx.prisma.blogPosts.findMany({
          where: {
            published: { lte: new Date() },
            ...(category !== BlogCategory.ALL && { category: category }),
          },
          orderBy: {
            published: "desc",
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
});
