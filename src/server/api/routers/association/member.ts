import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import z from "zod";
import { TRPCError } from "@trpc/server";
import logger from "@/server/logger";
import { calculateAge } from "@/lib/utils";

export const MemberRouter = createTRPCRouter({
  isMemberExist: publicProcedure
    .input(z.object({ memberId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        const { memberId } = input;
        return await ctx.prisma.$transaction(async (tx) => {
          const member = await tx.member.findUnique({
            where: {
                id: memberId,
            }
          });

          return !!member;
        });
      } catch (err) {
        logger.error({
          router: "Association",
          procedure: "isMemberExist",
          input,
          message: "isMemberExist failed",
          error: err,
        });

        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la lecture BD.",
        });
      }
    }),
    getContactMail: protectedProcedure
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
});
