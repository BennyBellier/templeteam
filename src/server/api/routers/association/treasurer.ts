import logger from "@/server/logger";
import { PaymentMethod } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, treasurerProcedure } from "@/server/api/trpc";
import { seasonSchema } from "./types";

export const TreasurerRouter = createTRPCRouter({
  getFilesWithNoPayment: treasurerProcedure
    .input(z.object({ season: seasonSchema }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.file.findMany({
        where: {
          season: input?.season,
          paymentMethod: {
            not: null,
          },
          paymentAmout: {
            not: null,
          },
        },
        include: {
          member: true,
          courses: true,
        },
      });
    }),
  updatePaymentForMember: treasurerProcedure
    .input(
      z.object({
        fileId: z.string().uuid(),
        paymentMethod: z.nativeEnum(PaymentMethod),
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
    }),
});
