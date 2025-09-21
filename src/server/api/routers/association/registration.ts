import { env } from "@/env.mjs";
import { calculateAge, calculateMembershipPrice } from "@/lib/utils";
import logger from "@/server/logger";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
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
  addFileMedic: publicProcedure
    .input(
      z.object({
        fileId: z.string().uuid(),
        medicFilename: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        logger.info({
          message: `Add medic to file ${input.fileId}.`,
          context: "tRPC",
          requestPath: "association.addMemberMedic",
          data: input,
        });

        return await ctx.prisma.file.update({
          where: {
            id: input.fileId,
          },
          data: {
            medicalCertificate: input.medicFilename,
          },
        });
      } catch (e) {
        logger.error({
          context: "tRPC",
          requestPath: "association.addMemberMedic",
          message: `Failed when trying to add medic to file ${input.fileId}.`,
          data: { e },
        });
        throw new Error(
          "Impossible d'ajouter le certificat médical, veuillez réessayer.",
        );
      }
    }),
  addFileFilename: publicProcedure
    .input(
      z.object({
        fileId: z.string().uuid(),
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
    .input(z.object({ memberId: z.string().uuid(), season: seasonSchema }))
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
        member: z.object({ id: z.string().uuid(), new: z.boolean() }),
        fileId: z.string().optional(),
        legalGuardians: z.array(
          z.object({ id: z.string().uuid(), new: z.boolean() }),
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
        memberId: z.string().uuid(),
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
        memberId: z.string().uuid(),
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
        memberId: z.string().uuid(),
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
  getEndOfTrialsInfos: publicProcedure.query(async ({ ctx }) => {
    const member = await ctx.prisma.member.findMany({
      select: {
        id: true,
        mail: true,
        files: {
          where: {
            season: env.FILE_SEASON,
          },
          select: {
            courses: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!member) return null;

    return member.map((m) => {
      return {
        id: m.id,
        mail: m.mail,
        membership: m.files[0]?.courses.map((course) => course.name),
      };
    });
  }),
  addMemberPictureAndCertificate: publicProcedure
    .input(
      z.object({
        memberId: z.string().uuid(),
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
    }),
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
        page: z.number().min(0).default(0),
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

/* async function createLegalGuardian(
  tx: Prisma.TransactionClient,
  data: {
    firstname: string;
    lastname: string;
    phone: string;
    mail?: string;
  },
  memberId: string,
) {
  const guardian = await tx.legalGuardian.create({
    data: {
      ...data,
      members: {
        connect: { id: memberId },
      },
    },
  });

  logger.info({
    context: "tRPC",
    requestPath: "createLegalGuardian",
    message: `Created new legal guardian ${guardian.id} linked to member ${memberId}.`,
    data: guardian,
  });

  return { id: guardian.id, new: true };
}

async function connectOrUpdateLegalGuardian(
  tx: Prisma.TransactionClient,
  existing: { id: string; mail: string | null },
  memberId: string,
  mail?: string,
) {
  await tx.legalGuardian.update({
    where: { id: existing.id },
    data: {
      mail: mail ?? existing.mail,
      members: { connect: { id: memberId } },
    },
  });

  logger.info({
    context: "tRPC",
    requestPath: "createLegalGuardian",
    message: `Connected existing legal guardian ${existing.id} to member ${memberId}.`,
  });

  return { id: existing.id, new: false };
}

async function deleteOrDisconnectLegalGuardian(
  tx: Prisma.TransactionClient,
  lg: { id: string; new: boolean },
  memberId: string,
) {
  // Ne rien faire si pas "nouveau"
  if (!lg.new) return;

  const record = await tx.legalGuardian.findUnique({
    where: { id: lg.id },
    include: { members: true },
  });

  if (!record) return;

  if (record.members.length === 1 && record.members[0]?.id === memberId) {
    // Supprimer complètement
    await tx.legalGuardian.delete({ where: { id: lg.id } });
    logger.info({
      context: "tRPC",
      message: `LegalGuardian ${lg.id} deleted (only linked to member ${memberId})`,
      requestPath: "deleteOrDisconnectLegalGuardian",
    });
  } else {
    // Juste déconnecter
    await tx.legalGuardian.update({
      where: { id: lg.id },
      data: { members: { disconnect: { id: memberId } } },
    });
    logger.info({
      context: "tRPC",
      message: `LegalGuardian ${lg.id} disconnected from member ${memberId}`,
      requestPath: "deleteOrDisconnectLegalGuardian",
    });
  }
}

async function deleteFile(tx: Prisma.TransactionClient, fileId: string) {
  const deleted = await tx.file.delete({ where: { id: fileId } });
  logger.info({
    context: "tRPC",
    requestPath: "deleteFile",
    message: `File ${fileId} deleted.`,
    data: deleted,
  });
} */

/* async function deleteMember(
  tx: Prisma.TransactionClient,
  member: { id: string; new: boolean },
) {
  if (!member.new) {
    logger.info({
      context: "tRPC",
      requestPath: "deleteMember",
      message: `Member ${member.id} not deleted (flag new=false).`,
    });
    return;
  }

  const deleted = await tx.member.delete({
    where: { id: member.id },
  });

  logger.info({
    context: "tRPC",
    requestPath: "deleteMember",
    message: `Member ${member.id} deleted.`,
    data: deleted,
  });
} */
