import { env } from "@/env.mjs";
import logger from "@/server/logger";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { phoneRegex } from "@/lib/utils";
import { Gender, Prisma } from "@prisma/client";

const loggerMetadata = { type: "trpc", router: "association" };

export const AssociationRouter = createTRPCRouter({
  createMember: publicProcedure
    .input(
      z.object({
        lastname: z.string().trim().toUpperCase(),
        firstname: z
          .string()
          .trim()
          .transform((value) => value.charAt(0).toUpperCase()),
        birthdate: z
          .date()
          .min(new Date(1970, 1, 1))
          .max(new Date()),
        gender: z.nativeEnum(Gender),
        mail: z.string().trim().email().optional(),
        phone: z.string().trim().regex(phoneRegex).optional(),
        address: z.string().trim(),
        city: z.string().trim().toUpperCase(),
        postalCode: z.string().trim(),
        country: z.string().trim().toUpperCase(),
        medicalComment: z.string().trim().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { firstname, lastname, birthdate, mail, phone } = input;
        let member = await ctx.prisma.member.findFirst({
          where: {
            OR: [
              {
                firstname,
                lastname,
                birthdate,
              },
              {
                mail,
              },
              {
                phone,
              },
            ],
          },
        });
        if (member) {
          throw new Error("Un membre avec les mêmes informations existe déjà.");
        }
        member = await ctx.prisma.member.create({
          data: {
            ...input,
          },
        });

        return member.id;
      } catch (e) {
        // Gestion des erreurs Prisma et autres erreurs
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          throw new Error(
            "Un membre avec cette adresse e-mail ou ce numéro de téléphone existe déjà.",
          );
        } else if (e instanceof Error) {
          throw new Error(e.message); // Autres erreurs personnalisées
        } else {
          throw new Error(
            "Une erreur inconnue est survenue lors de la création du membre.",
          );
        }
      }
    }),
  addMemberPhoto: publicProcedure
    .input(
      z.object({
        memberId: z.string().uuid(),
        photoFilename: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.member.update({
        where: {
          id: input.memberId,
        },
        data: {
          photo: input.photoFilename,
        },
      });
    }),
  getCourses: publicProcedure.query(async ({ ctx }) => {
    const courses = await ctx.prisma.course.findMany({
      select: {
        name: true,
        description: true,
        info: true,
        sessions: {
          select: {
            id: true,
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
    });
    return courses;
  }),
  /* createLegalGuardians:
  createMemberAndFile: publicProcedure
    .input(
      z.object({
        firstname: z
          .string()
          .trim()
          .transform((value) => value.charAt(0).toUpperCase()),
        lastname: z.string().trim().toUpperCase(),
        birthdate: z.date().min(new Date(1970, 1, 1)),
        gender: z.string().trim(),
        mail: z.string().trim().optional(),
        phone: z.string().trim().optional(),
        address: z.string().trim(),
        city: z.string().trim().toUpperCase(),
        postalCode: z.string().trim(),
        country: z.string().trim().toUpperCase(),
        photo: z.string().trim(),
        medicalComment: z.string().trim().optional(),

        undersigner: z.string().trim(),
        signature: z.string(),

        courses: z.array(z.string().trim()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        firstname,
        lastname,
        birthdate,
        gender,
        mail,
        phone,
        address,
        city,
        postalCode,
        country,
        photo,
        medicalComment,
        undersigner,
        signature,
        courses,
      } = input;
      let member = await ctx.prisma.member.findUnique({
        where: {
          OR: [
            {
              lastnam
              firstname,
              lastname,
              birthdate,
            },
            {
              mail,
            },
            {
              phone,
            },
          ],
        },
      });
      if (!member) {
        member = await ctx.prisma.member.create({
          data: {
            firstname,
            lastname,
            birthdate,
            gender,
            mail,
            phone,
            address,
            city,
            postalCode,
            country,
            photo,
            medicalComment,
          },
        });
      }

      await ctx.prisma.file.create({
        data: {
          year: env.FILE_YEAR,
          undersigner,
          signature,
          memberId: member.id,
          courses: {
            connect: [...courses.map((course) => ({ name: course }))],
          },
        },
      });

      return member.id;
    }), */
  createLegalGuardian: publicProcedure
    .input(
      z.object({
        firstname: z
          .string()
          .trim()
          .transform((value) => value.charAt(0).toUpperCase()),
        lastname: z.string().trim().toUpperCase(),
        phone: z
          .string()
          .trim()
          .regex(phoneRegex, "Numéro de téléphone invalide."),
        mail: z.string().email("Adresse e-mail invalide.").optional(),
        memberId: z.string().uuid("Identifiant de membre invalide."),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { memberId, firstname, lastname, phone, mail } = input;

        // Search if member to connect exist
        const member = await ctx.prisma.member.findUnique({
          where: {
            id: memberId,
          },
        });

        if (!member) {
          throw new Error("Le membre spécifié n'existe pas.");
        }

        // Search existing legal guardians with phone or mail
        const existingLegalGuardian = await ctx.prisma.legalGuardian.findFirst({
          where: {
            OR: [
              { phone: input.phone }, // Vérifie le numéro de téléphone
              { mail: input.mail }, // Vérifie l'email
            ],
          },
        });

        if (!existingLegalGuardian) {
          // Create new legal guardians and link to member
          const newLegalGuardian = await ctx.prisma.legalGuardian.create({
            data: {
              firstname,
              lastname,
              phone,
              mail,
              members: {
                connect: {
                  id: memberId,
                },
              },
            },
          });

          return newLegalGuardian.id; // Return ID of new legal guardians
        }

        // Update link if legal guardian already exist
        await ctx.prisma.legalGuardian.update({
          where: {
            id: existingLegalGuardian.id,
          },
          data: {
            mail: mail ?? existingLegalGuardian.mail,
            members: {
              connect: {
                id: memberId,
              },
            },
          },
        });

        return existingLegalGuardian.id; // return ID of existing legalGuardian
      } catch (e) {
        // Gestion des erreurs Prisma et autres erreurs
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          throw new Error(
            "Un responsable légal avec ce numéro de téléphone existe déjà.",
          );
        } else if (e instanceof Error) {
          throw new Error(e.message); // Autres erreurs personnalisées
        } else {
          throw new Error(
            "Une erreur inconnue est survenue lors de l'ajout du responsable légal.",
          );
        }
      }
    }),
  getMemberAllinformations: publicProcedure
    .input(z.object({ memberId: z.string().uuid(), year: z.string().trim() }))
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
              year: input.year,
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
            year: env.FILE_YEAR,
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
          year_memberId: {
            year: env.FILE_YEAR,
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
