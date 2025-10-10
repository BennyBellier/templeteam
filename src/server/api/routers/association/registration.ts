import { env } from "@/env.mjs";
import { calculateAge, calculateMembershipPrice } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import logger from "@/server/logger";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  checkCoursesExist,
  createFile,
  getFile,
  getMemberByIndex,
  hasPreviousSeasonFile,
  upsertLegalGuardian,
  upsertMember,
} from "./helpers";
import {
  CreateFileInputSchema,
  isMemberHaveFileSchema,
  seasonSchema,
} from "./types";

export const RegistrationRouter = createTRPCRouter({
  isMemberHaveFile: publicProcedure
    .input(isMemberHaveFileSchema)
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.$transaction(async (tx): Promise<boolean> => {
          const member = await getMemberByIndex(tx, { ...input });

          if (!member) return false;

          const file = await getFile(tx, input.season, member.id);

          return file !== null;
        });
      } catch (err) {
        logger.error({
          router: "Association",
          procedure: "isMemberHaveFile",
          input: {
            season: input.season,
            firstname: input.firstname,
            lastname: input.lastname,
          },
          message: "isMemberHaveFile failed",
          error: err,
        });

        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Erreur lors de la vérification d'éligibilité à l'inscription.",
        });
      }
    }),
  registerMemberWithFile: publicProcedure
    .input(CreateFileInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const {
          member,
          photo,
          legalGuardians = [],
          season,
          courses,
          undersigner,
          signature,
        } = input;

        const result = await ctx.prisma.$transaction(async (tx) => {
          const member_fetch = await upsertMember(tx, member, photo);

          if (!member_fetch)
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Erreur lors de l'enregistrement de l'adhérent",
            });

          await upsertLegalGuardian(tx, legalGuardians, member_fetch.id);

          await checkCoursesExist(tx, courses);

          await createFile(
            tx,
            { season, courses, undersigner, signature },
            member_fetch.id,
          );

          return { memberId: member_fetch.id };
        });

        logger.info({
          router: "Association",
          procedure: "registerMemberWithFile",
          input: {
            season: input.season,
            firstname: input.member.firstname,
            lastname: input.member.lastname,
          },
          message: `Succesfully register member.`,
        });

        return result;
      } catch (err) {
        logger.error({
          router: "Association",
          procedure: "registerMemberWithFile",
          input: {
            season: input.season,
            firstname: input.member.firstname,
            lastname: input.member.lastname,
          },
          message: "registerMemberWithFile failed",
          error: err,
        });

        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la création du dossier.",
        });
      }
    }),
  isMemberHaveMedicalFileForSeason: publicProcedure
    .input(z.object({ memberId: z.uuidv4(), season: seasonSchema }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.$transaction(async (tx) => {
          const fetch = await tx.file.findUnique({
            where: {
              season_memberId: {
                season: input.season,
                memberId: input.memberId,
              },
            },
            select: {
              medicalCertificate: true,
            },
          });

          if (!fetch) return false;

          return fetch.medicalCertificate !== null;
        });
      } catch (err) {
        logger.error({
          router: "Association",
          procedure: "isMemberHaveMedicalFileForSeason",
          input,
          message: "isMemberHaveMedicalFileForSeason failed",
          error: err,
        });

        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Erreur lors de la vérification d'éligibilité à l'inscription.",
        });
      }
    }),
  addMemberMedicalFileForSeason: publicProcedure
    .input(
      z.object({
        memberId: z.uuidv4(),
        season: seasonSchema,
        medic_filename: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.$transaction(async (tx) => {
          const updated = await tx.file.update({
            where: {
              season_memberId: {
                season: input.season,
                memberId: input.memberId,
              },
            },
            data: {
              medicalCertificate: input.medic_filename,
            },
          });

          if (!updated) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Aucun dossier trouvé pour cette saison ${input.season}.`,
            });
          }
        });
      } catch (err) {
        logger.error({
          router: "Association",
          procedure: "addMemberMedicalFileForSeason",
          input,
          message: "addMemberMedicalFileForSeason failed",
          error: err,
        });

        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la création du dossier.",
        });
      }
    }),
  addFileFilename: publicProcedure
    .input(
      z.object({
        fileId: z.uuidv4(),
        filename: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        logger.info({
          context: "tRPC",
          requestPath: "association.addFileFilename",
          message: `Add medic to file ${input.fileId}.`,
          data: input,
        });

        return await ctx.prisma.file.update({
          where: {
            id: input.fileId,
          },
          data: {
            filename: input.filename,
          },
        });
      } catch (e) {
        logger.error({
          context: "tRPC",
          requestPath: "association.addFileFilename",
          message: `Failed when trying to add medic to file ${input.fileId}.`,
          data: { e },
        });
        throw new Error(
          "Impossible d'ajouter le certificat médical, veuillez réessayer.",
        );
      }
    }),
  getConfirmationMailInformationsForSeason: publicProcedure
    .input(z.object({ memberId: z.uuidv4(), season: seasonSchema }))
    .query(async ({ ctx, input }) => {
      const member = await ctx.prisma.member.findUnique({
        select: {
          firstname: true,
          lastname: true,
          birthdate: true,
          gender: true,
          mail: true,
          phone: true,
          address: true,
          city: true,
          country: true,
          postalCode: true,
          medicalComment: true,
          photo: true,
          files: {
            where: {
              AND: {
                season: input.season,
                memberId: input.memberId,
              },
            },
            orderBy: { createdAt: "desc" },
            select: {
              courses: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
          legalGuardians: {
            select: {
              firstname: true,
              lastname: true,
              phone: true,
              mail: true,
            },
          },
        },
        where: { id: input.memberId },
      });

      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Membre introuvable.",
        });
      }

      const isAdult = member.birthdate
        ? calculateAge(member.birthdate) >= 18
        : false;

      const memberInfo = {
        firstname: member.firstname,
        lastname: member.lastname,
        birthdate: member.birthdate,
        gender: member.gender,
        phone: member.phone,
        mail: member.mail,
        address: member.address,
        city: member.city,
        country: member.country,
        postalCode: member.postalCode,
        medicalComment: member.medicalComment,
        photo: member.photo,
      };

      const legalGuardians = member.legalGuardians.map((lg) => ({
        firstname: lg.firstname,
        lastname: lg.lastname,
        phone: lg.phone,
        mail: lg.mail,
      }));

      // Détermination du destinataire du mail
      let mailTo: string | null = null;
      if (isAdult && member.mail) {
        mailTo = member.mail;
      } else if (!isAdult) {
        mailTo =
          legalGuardians.find((val) => !!val.mail)?.mail ?? member.mail ?? null;
      }

      if (!mailTo) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Impossible d’envoyer la confirmation : aucun email disponible.",
        });
      }

      if (!member.files[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Aucun dossier trouvé pour ce membre et cette saison.",
        });
      }

      const file = member.files[0];

      const hadFile = await hasPreviousSeasonFile(
        ctx.prisma,
        input.memberId,
        input.season,
      );
      const selectedCoursesPrices = file.courses.map(({ price }) => price);
      const price = calculateMembershipPrice(hadFile, selectedCoursesPrices);

      return {
        mailTo,
        price,
        ...memberInfo,
        legalGuardians,
        courses: file.courses.map((c) => c.name),
      };
    }),
  /* deleteMember: publicProcedure
    .input(
      z.object({
        member: z.object({ id: z.uuidv4(), new: z.boolean() }),
        fileId: z.string().optional(),
        legalGuardians: z.array(
          z.object({ id: z.uuidv4(), new: z.boolean() }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { member, legalGuardians = [], fileId } = input;

      try {
        await ctx.prisma.$transaction(async (tx) => {
          for (const lg of legalGuardians) {
            await deleteOrDisconnectLegalGuardian(tx, lg, member.id);
          }

          if (fileId) {
            await deleteFile(tx, fileId);
          }

          await deleteMember(tx, member);
        });
      } catch (e) {
        logger.error({
          context: "tRPC",
          message: "[deleteMember] Error while trying to delete member.",
          data: e,
        });
        throw new Error(
          e instanceof Error
            ? e.message
            : "Erreur inconnue lors de la suppression du membre.",
        );
      }
    }), */
  getMemberResume: publicProcedure
    .input(
      z.object({
        memberId: z.uuidv4(),
        year: z.string().trim().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const member = await ctx.prisma.member.findFirst({
        omit: {
          createdAt: true,
          updatedAt: true,
        },
        include: {
          files: {
            select: {
              id: true,
              medicalCertificate: true,
              courses: {
                select: {
                  name: true,
                },
              },
            },
          },
          legalGuardians: {
            omit: {
              id: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        where: { id: input.memberId },
      });

      return member;
    }),
  getMemberRegistrationFileInfo: publicProcedure
    .input(
      z.object({
        memberId: z.uuidv4(),
        year: z.string().trim().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.member.findFirst({
        omit: {
          createdAt: true,
          updatedAt: true,
        },
        include: {
          files: {
            omit: {
              updatedAt: true,
            },
            include: {
              courses: {
                select: {
                  price: true,
                },
              },
            },
          },
          legalGuardians: {
            omit: {
              id: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        where: { id: input.memberId },
      });
    }),
  getMemberAllinformations: publicProcedure
    .input(
      z.object({
        memberId: z.uuidv4(),
        year: z.string().trim().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const member = await ctx.prisma.member.findFirst({
        select: {
          firstname: true,
          lastname: true,
          birthdate: true,
          gender: true,
          mail: true,
          phone: true,
          address: true,
          city: true,
          postalCode: true,
          medicalComment: true,
          photo: true,
          files: {
            where: {
              season: input.year ?? env.FILE_SEASON,
            },
            select: {
              medicalCertificate: true,
              courses: {
                select: {
                  name: true,
                },
              },
            },
          },
          legalGuardians: {
            select: {
              firstname: true,
              lastname: true,
              phone: true,
              mail: true,
            },
          },
        },
        where: { id: input.memberId },
      });

      if (!member) return null;

      return {
        firstname: member.firstname,
        lastname: member.lastname,
        birthdate: member.birthdate,
        gender: member.gender,
        mail: member.mail,
        phoneNumber: member.phone,
        address: member.address,
        city: member.city,
        postalCode: member.postalCode,
        medicalComment: member.medicalComment,
        photo: member.photo,
        legalGuardians: member.legalGuardians.map((legalGuardian) => ({
          firstname: legalGuardian.firstname,
          lastname: legalGuardian.lastname,
          phone: legalGuardian.phone,
          mail: legalGuardian.mail,
        })),
      };
    }),
  /*   addMemberPictureAndCertificate: publicProcedure
    .input(
      z.object({
        memberId: z.uuidv4(),
        photoFilename: z.string(),
        certificateFilename: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.member.update({
        where: {
          id: input.memberId,
        },
        data: {
          photo: input.photoFilename,
        },
      });

      await ctx.prisma.file.update({
        where: {
          season_memberId: {
            season: env.FILE_SEASON,
            memberId: input.memberId,
          },
        },
        data: {
          medicalCertificate: input.certificateFilename,
        },
      });
    }), */
  getMembersList: publicProcedure.query(async ({ ctx }) => {
    const members = await ctx.prisma.member.findMany({
      include: {
        legalGuardians: true,
      },
    });

    return members;
  }),
  getFileList: publicProcedure
    .input(
      z.object({
        page: z.number().min(0).prefault(0),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, cursor } = input;
      const take = env.FILE_PAGINATION_SIZE;
      const skip = page * take;
      const files = await ctx.prisma.file.findMany({
        include: {
          member: true,
          courses: true,
        },
        take: take + 1,
        skip,
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (files.length > take) {
        const nextItem = files.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return { files, nextCursor };
    }),
});
