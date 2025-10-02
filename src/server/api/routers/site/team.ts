import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const teamMembersRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.teamMembers.findMany({
      include: { videos: true, skills: true },
    });
  }),
});
