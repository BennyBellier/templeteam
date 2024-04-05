import { createTRPCRouter, publicProcedure } from "./../trpc";
// import { z } from "zod";

export const teamMembersRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.teamMembers.findMany({
      include: { videos: true, skills: true },
    });
  }),
});
