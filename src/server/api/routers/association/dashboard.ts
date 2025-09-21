import { type ChartConfig } from "@/components/ui/chart";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import z from "zod";
import { seasonSchema } from "./types";

export const DashboardRouter = createTRPCRouter({
  getSeasonMemberCount: protectedProcedure
    .input(
      z.object({
        season: seasonSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const { season } = input;
      return await ctx.prisma.file.count({ where: { season } });
    }),
  getSeasonMemberPerCourses: protectedProcedure
    .input(
      z.object({
        season: seasonSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const { season } = input;
      return await ctx.prisma.course.findMany({
        select: {
          name: true,
          _count: {
            select: {
              Files: {
                where: {
                  season,
                },
              },
            },
          },
        },
      });
    }),
  getSeasonPieInformation: protectedProcedure
    .input(
      z.object({
        season: seasonSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const { season } = input;

      const fetchCourses = await ctx.prisma.course.findMany({
        select: {
          name: true,
        },
      });

      const coursesConfig = Object.fromEntries(
        fetchCourses.map((course) => [
          course.name,
          {
            label: course.name,
          },
        ]),
      ) satisfies ChartConfig;

      const config = {
        members: {
          label: "Adhérents",
        },
        ...coursesConfig,
      } satisfies ChartConfig;

      const fetch = await ctx.prisma.course.findMany({
        select: {
          name: true,
          _count: {
            select: {
              Files: {
                where: {
                  season,
                },
              },
            },
          },
        },
      });

      const data = fetch.map((val, idx) => {
        return {
          course: val.name,
          members: val._count.Files,
          fill: `var(--chart-${idx + 1})`
        };
      });

      const total = await ctx.prisma.file.count({ where: { season } });

      return {
        chartData: data,
        chartConfig: config,
        totalMembers: total,
      };
    }),
});
