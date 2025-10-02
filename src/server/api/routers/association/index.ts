import { env } from "@/env.mjs";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CoursesRouter } from "./courses";
import { DashboardRouter } from "./dashboard";
import { RegistrationRouter } from "./registration";
import { TreasurerRouter } from "./treasurer";

export const AssociationRouter = createTRPCRouter({
  courses: CoursesRouter,
  registration: RegistrationRouter,
  dashboard: DashboardRouter,
  treasurer: TreasurerRouter,

  getCurrentSeason: publicProcedure.query(() => {
    return env.FILE_SEASON;
  }),
});
