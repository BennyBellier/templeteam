import { type ChartConfig } from "@/components/ui/chart";
import { calculateAge } from "@/lib/utils";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PaymentStatus, Prisma } from "@prisma/client";
import z from "zod";
import { seasonSchema } from "./types";
import { paths } from "@/server/fs/paths";

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
          fill: `var(--chart-${idx + 1})`,
        };
      });

      const total = await ctx.prisma.file.count({ where: { season } });

      return {
        chartData: data,
        chartConfig: config,
        totalMembers: total,
      };
    }),

  getSeasonMemberList: protectedProcedure
    .input(
      z.object({
        season: seasonSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const { season } = input;

      const seasonMembersList = Prisma.validator<Prisma.FileFindManyArgs>()({
        select: {
          medicalCertificate: true,
          paymentStatus: true,
          member: {
            select: {
              id: true,
              photo: true,
              firstname: true,
              lastname: true,
              gender: true,
              birthdate: true,
              mail: true,
              phone: true,
              medicalComment: true,
              legalGuardians: {
                select: {
                  firstname: true,
                  lastname: true,
                  phone: true,
                },
              },
            },
          },
          courses: {
            select: {
              name: true,
            },
          },
        },
      });

      const fetch = await ctx.prisma.file.findMany({
        ...seasonMembersList,
        where: {
          season,
        },
      });

      return fetch.map(
        ({ member, courses, medicalCertificate, paymentStatus }) => {
          const photo = member.photo
            ? paths.members.photos(member.id).public(member.photo)
            : undefined;
          const age = calculateAge(member.birthdate);

          return {
            id: member.id,
            photo,
            name: `${member.firstname} ${member.lastname}`,
            gender: member.gender,
            age,
            mail: member.mail,
            phone: member.phone,
            courses: courses.map(({ name }) => name),
            medicalComment: member.medicalComment,
            medicalCertificate: medicalCertificate ? true : false,
            payment: paymentStatus,
            emergencyContact: member.legalGuardians.map(
              ({ firstname, lastname, phone }) => {
                return {
                  name: `${firstname} ${lastname}`,
                  phone: phone,
                };
              },
            ),
          };
        },
      );
    }),

  getOverallContributionStatus: protectedProcedure
    .input(
      z.object({
        season: seasonSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const paid = await ctx.prisma.file.count({
        where: {
          AND: {
            season: input.season,
            paymentStatus: PaymentStatus.Paid,
          },
        },
      });

      const total = await ctx.prisma.file.count({
        where: {
          AND: {
            season: input.season,
          },
        },
      });

      return { chartData: [{ paid, overdue: total - paid }], total };
    }),

  /* getReEnrolmentRate: protectedProcedure
    .input(
      z.object({
        season: seasonSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
    }), */
});
