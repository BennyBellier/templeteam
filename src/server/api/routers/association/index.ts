import { env } from "@/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { CoursesRouter } from "./courses";
import { DashboardRouter } from "./dashboard";
import { RegistrationRouter } from "./registration";
import { TreasurerRouter } from "./treasurer";
import { MailRouter } from "./mail";

export const AssociationRouter = createTRPCRouter({
  courses: CoursesRouter,
  registration: RegistrationRouter,
  dashboard: DashboardRouter,
  treasurer: TreasurerRouter,
  mail: MailRouter,

  getCurrentSeason: publicProcedure.query(() => {
    return env.FILE_SEASON;
  }),

  getSeasons: protectedProcedure.query(async ({ ctx }) => {
    const seasonsFetch = await ctx.prisma.file.findMany({
      distinct: "season",
      select: {
        season: true,
      },
      orderBy: {
        season: "desc"
      }
    });

    const seasons = seasonsFetch.flatMap(({ season }) => season);

    if (!seasons.includes(env.FILE_SEASON)) {
      seasons.unshift(env.FILE_SEASON);
    }

    return {
      seasons,
      currentSeason: env.FILE_SEASON,
    };
  }),
});
