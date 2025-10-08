import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import z from "zod";
import { seasonSchema } from "./types";
import { contributionCalculation, getMemberById, isNewMember } from "./helpers";
import { TRPCError } from "@trpc/server";
import logger from "@/server/logger";
import { calculateAge } from "@/lib/utils";

export const MailRouter = createTRPCRouter({
  getMemberContactMail: protectedProcedure
    .input(z.object({ memberId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        const { memberId } = input;
        return await ctx.prisma.$transaction(async (tx) => {
          const member = await tx.member.findUnique({
            where: { id: memberId },
            select: {
              legalGuardians: {
                select: {
                  mail: true,
                },
              },
              mail: true,
              birthdate: true
            },
          });

          if (!member)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Aucun adhérent n'a été trouvé.",
            });

            const isAdult = calculateAge(member.birthdate);

          let mailTo: string | null = null;
          if (isAdult && member.mail) {
            mailTo = member.mail;
          } else if (!isAdult) {
            mailTo =
              member.legalGuardians.find((val) => !!val.mail)?.mail ??
              member.mail ??
              null;
          }

          if (!mailTo) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message:
                "Impossible d’envoyer la confirmation : aucun email disponible.",
            });
          }

          return mailTo;
        });
      } catch (err) {
        logger.error({
          router: "Association",
          procedure: "getMemberContactMail",
          input,
          message: "getMemberContactMail failed",
          error: err,
        });

        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la récupération des données.",
        });
      }
    }),
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
});
