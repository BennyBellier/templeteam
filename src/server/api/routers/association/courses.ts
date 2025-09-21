import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
// import { z } from "zod";

export const CoursesRouter = createTRPCRouter({
  getCourses: publicProcedure.query(async ({ ctx }) => {
    const courses = await ctx.prisma.course.findMany({
      select: {
        name: true,
        description: true,
        info: true,
        sessions: {
          select: {
            id: true,
            dayOfWeek: true,
            startHour: true,
            endHour: true,
            location: {
              select: {
                place: true,
                city: true,
                postalCode: true,
                query: true,
              },
            },
          },
        },
      },
    });
    return courses;
  }),
});
