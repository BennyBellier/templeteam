import { calculateAge } from "@/lib/utils";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import logger from "@/server/logger";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { contributionCalculation, isNewMember } from "./helpers";
import { seasonSchema } from "./types";

export const MailRouter = createTRPCRouter({
  getEndOfTrialsForMember: protectedProcedure
    .input(
      z.object({
        memberId: z.string().uuid(),
        season: seasonSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { memberId, season } = input;
        return await ctx.prisma.$transaction(async (tx) => {
          const data = await ctx.prisma.file.findUnique({
            select: {
              courses: {
                select: {
                  name: true,
                  price: true,
                  sessions: {
                    select: {
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
              },
            },
            where: {
              season_memberId: {
                season,
                memberId,
              },
            },
          });

          if (!data) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Aucun adhérent n'a été trouvé.",
            });
          }

          // Extract only the prices from the courses
          const prices = data.courses.map((course) => course.price);

          const contributionPrice = (await isNewMember(tx, memberId))
            ? contributionCalculation(prices, 20)
            : contributionCalculation(prices, 0);

          const courses = data.courses.map((course) => {
            const sessions = course.sessions.map((session) => ({
              dayOfWeek: session.dayOfWeek,
              startHour: session.startHour,
              endHour: session.endHour,
              place: session.location.place,
              city: session.location.city,
              postalCode: session.location.postalCode,
              query: session.location.query,
            }));

            return { name: course.name, sessions };
          });

          return {
            price: contributionPrice,
            courses,
          };
        });
      } catch (err) {
        logger.error({
          router: "Association",
          procedure: "getEndOfTrialsForMember",
          input,
          message: "getEndOfTrialsForMember failed",
          error: err,
        });

        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la récupération des données.",
        });
      }
    }),
  getMembersMailContact: protectedProcedure
    .input(z.object({ season: seasonSchema }))
    .query(async ({ ctx, input }) => {
      const files = await ctx.prisma.file.findMany({
        where: {
          season: input.season,
        },
        select: {
          member: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              mail: true,
              birthdate: true,
              legalGuardians: {
                select: {
                  mail: true,
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

      return files.map((file) => {
        const { member, courses } = file;
        const isAdult = calculateAge(member.birthdate) >= 18;

        let mailTo: string | null = null;
        if (isAdult && member.mail) {
          mailTo = member.mail;
        } else if (!isAdult) {
          const lg = member.legalGuardians.find((val) => val.mail !== null);
          mailTo = lg?.mail ?? member.mail;
        }

        return {
          id: member.id,
          name: `${member.firstname} ${member.lastname}`,
          mail: mailTo,
          courses: courses.map(({ name }) => name),
        };
      });
    }),
});
