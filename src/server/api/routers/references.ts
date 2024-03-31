import { createTRPCRouter, publicProcedure } from "./../trpc";
// import { z } from "zod";

export const referencesRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.references.findMany();
  }),
});
