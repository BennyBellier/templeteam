import { createTRPCRouter, treasurerReadProcedure } from "@/server/api/trpc";
import logger from "@/server/logger";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { contributionCalculation, isNewMember } from "./helpers";
import { seasonSchema } from "./types";

export const TreasurerRouter = createTRPCRouter({
  getSubscriptionsForSeason: treasurerReadProcedure
    .input(
      z.object({
        season: seasonSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { season } = input;
        return await ctx.prisma.$transaction(async (tx) => {
          const files = await tx.file.findMany({
            where: {
              season,
            },
            include: {
              member: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                },
              },
              courses: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          });

          const result = await Promise.all(
            files.map(async (file) => {
              const prices = file.courses.map((course) => course.price);

              const contributionPrice = (await isNewMember(tx, file.member.id))
                ? contributionCalculation(prices, 20)
                : contributionCalculation(prices, 0);

              return {
                id: file.id,
                name: `${file.member.firstname} ${file.member.lastname}`,
                courses: file.courses.map((c) => c.name),
                paymentStatus: file.paymentStatus,
                contributionPrice,
                paymentAmout: file.paymentAmout,
                paymentMethod: file.paymentMethod,
                paymentDetails: file.paymentDetails,
              };
            }),
          );

          const totalSubscription = result.reduce(
            (sum, s) => sum + s.contributionPrice,
            0,
          );

          return result;
        });
      } catch (err) {
        logger.error({
          router: "Treasurer",
          procedure: "getSubscriptionsForSeason",
          input,
          message: "getSubscriptionsForSeason failed",
          error: err,
        });

        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la récupération des données.",
        });
      }
    }),
  /* updatePaymentForMember: treasurerManageProcedure
    .input(
      z.object({
        fileId: z.uuidv4(),
        paymentMethod: z.enum(PaymentMethod),
        paymentDetails: z.string().optional(),
        payementAmout: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        logger.info({
          context: "tRPC",
          requestPath: "treasurer.updatePaymentForMember",
          message: `payment informations for file ${input.fileId}.`,
          data: input,
        });

        return await ctx.prisma.file.update({
          where: {
            id: input.fileId,
          },
          data: {
            paymentMethod: input.paymentMethod,
            paymentDetails: input.paymentDetails,
            paymentAmout: input.payementAmout,
          },
        });
      } catch (e) {
        logger.error({
          context: "tRPC",
          requestPath: "association.updatePaymentForMember",
          message: `Failed when trying update payment informations of fileId: ${input.fileId}.`,
          data: e,
        });
        throw new Error("Impossible d'ajouter la photo, veuillez réessayer.");
      }
    }), */
});
