import {
  createTRPCRouter,
  treasurerManageProcedure,
  treasurerReadProcedure,
} from "@/server/api/trpc";
import logger from "@/server/logger";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
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
                subscriptionPrice: contributionPrice,
                paymentAmount: file.paymentAmount,
                paymentMethod: file.paymentMethod,
                paymentDetails: file.paymentDetails,
              };
            }),
          );

          const totalSubscription = result.reduce(
            (sum, s) => sum + s.subscriptionPrice,
            0,
          );

          const totalPaid = result.reduce((sum, s) => {
            const val = s.paymentAmount ?? 0;
            return sum + val;
          }, 0);

          const totalOverdue = totalSubscription - totalPaid;

          return {
            totalSubscription,
            totalPaid,
            totalOverdue,
            files: result,
          };
        });
      } catch (err) {
        logger.error({
          context: "tRPC",
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
  updatePaymentForMember: treasurerManageProcedure
    .input(
      z.object({
        fileId: z.uuidv4(),
        changes: z.object({
          paymentAmount: z.number().optional(),
          paymentStatus: z.enum(PaymentStatus).optional(),
          paymentMethod: z.enum(PaymentMethod).optional(),
          paymentDetails: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { fileId, changes } = input;

        return await ctx.prisma.$transaction(async (tx) => {
          const updatedFile = await tx.file.update({
            where: {
              id: fileId,
            },
            data: {
              paymentAmount: changes.paymentAmount,
              paymentStatus: changes.paymentStatus,
              paymentMethod: changes.paymentMethod,
              paymentDetails: changes.paymentDetails,
            },
            include: {
              member: {
                select: {
                  firstname: true,
                  lastname: true,
                  id: true,
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

          const prices = updatedFile.courses.map((course) => course.price);

          const contributionPrice = (await isNewMember(
            tx,
            updatedFile.member.id,
          ))
            ? contributionCalculation(prices, 20)
            : contributionCalculation(prices, 0);

          return {
            id: updatedFile.id,
            name: `${updatedFile.member.firstname} ${updatedFile.member.lastname}`,
            courses: updatedFile.courses.map((c) => c.name),
            paymentStatus: updatedFile.paymentStatus,
            subscriptionPrice: contributionPrice,
            paymentAmount: updatedFile.paymentAmount,
            paymentMethod: updatedFile.paymentMethod,
            paymentDetails: updatedFile.paymentDetails,
          };
        });
      } catch (err) {
        logger.error({
          context: "tRPC",
          router: "Treasurer",
          procedure: "getSubscriptionsForSeason",
          input,
          message:
            "Failed when trying update payment informations of fileId: ${input.fileId}.",
          error: err,
        });

        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la mise à jour des données.",
        });
      }
    }),
});
