import { createTRPCRouter, publicProcedure } from "../trpc";

export const photosRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.photos.findMany();
  }),
});
