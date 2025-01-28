import { env } from "@/env.mjs";
import { calculateAge, phoneRegex } from "@/lib/utils";
import logger from "@/server/logger";
import { Gender, Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { RouterLike, UtilsLike } from '@trpc/react-query/shared';

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
          logger.warn({
            ...loggerMetadata,
            endpoint: "createMember",
            action: "error",
            input: {
              firstname,
              lastname,
              birthdate,
              mail,
              phone,
            },
            message: `Un membre avec les mêmes informations existe déjà.`,
          });
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
          logger.warn({
            ...loggerMetadata,
            endpoint: "createLegalGuardian",
            action: "error",
            message: `Impossible de créer un responsables légale pour l'identifiant : ${memberId} associé à aucun membre.`,
          });
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

          logger.info({
            ...loggerMetadata,
            endpoint: "createLegalGuardian",
            action: "create",
            input: {
              firstname,
              lastname,
              phone,
              mail,
              memberId,
            },
            message: `Création du responsable ${firstname} ${lastname} pour le membre ${member.firstname} ${member.lastname}.`,
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

        logger.info({
          ...loggerMetadata,
          endpoint: "createLegalGuardian",
          action: "update",
          input: {
            firstname,
            lastname,
            phone,
            oldmail: existingLegalGuardian.mail,
            mail,
            memberId,
          },
          message: `Ajout du responsable ${firstname} ${lastname} pour le membre ${member.firstname} ${member.lastname}.`,
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
  createFileForMember: publicProcedure
    .input(
      z.object({
        memberId: z.string().uuid("Identifiant de membre invalide."),
        year: z.date().optional(),
        courses: z.array(z.string()),
        undersigner: z.string().trim(),
        signature: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { memberId, year, courses, undersigner, signature } = input;

        // Search if member to connect exist
        const member = await ctx.prisma.member.findUnique({
          where: {
            id: memberId,
          },
        });

        if (!member) {
          logger.warn({
            ...loggerMetadata,
            endpoint: "createFileForMember",
            action: "error",
            input: {
              memberId,
            },
            message: `Impossible de créer un fichier pour l'identifiant : ${memberId} associé à aucun membre.`,
          });
          throw new Error("Le membre spécifié n'existe pas.");
        }

        const fileExists = await ctx.prisma.file.findUnique({
          where: {
            year_memberId: {
              year: year ?? env.FILE_YEAR,
              memberId,
            },
          },
        });

        if (fileExists) {
          const yearString = `${(year ?? env.FILE_YEAR).getFullYear()}/${(year ?? env.FILE_YEAR).getFullYear() + 1}`;

          logger.warn({
            ...loggerMetadata,
            endpoint: "createFileForMember",
            action: "error",
            input: {
              memberId,
              year,
            },
            message: `Impossible de créer un dossier pour ${member.lastname} ${member.firstname}, car un dossier pour l'année ${yearString} existe déjà.`,
          });
          throw new Error(
            `Un dossier pour l'année ${yearString} existe déjà pour le membre ${member.firstname} ${member.lastname}.`,
          );
        }

        // Search if all courses exists
        const coursesCheck = await ctx.prisma.course.findMany({
          where: {
            name: {
              in: courses,
            },
          },
        });

        if (coursesCheck.length !== courses.length) {
          const coursesFind = new Set(
            coursesCheck.map((course) => course.name),
          );
          const coursesNotFound: string[] = courses.filter(
            (course) => !coursesFind.has(course),
          );
          logger.warn({
            ...loggerMetadata,
            endpoint: "createFileForMember",
            action: "error",
            input: {
              memberId,
              courses,
            },
            message: `Impossible de créer un dossier pour l'identifiant : ${memberId} car les cours suivants ne sont pas reconnus : ${coursesNotFound.join(" ")}.`,
          });
          throw new Error(
            `Les cours suivants ne sont pas reconnus : ${coursesNotFound.join(" ")}`,
          );
        }

        // File creation
        const file = await ctx.prisma.file.create({
          data: {
            year: year ?? env.FILE_YEAR,
            courses: {
              connect: Object.keys(courses).map((key) => ({
                name: key,
              })),
            },
            undersigner,
            signature,
            member: {
              connect: {
                id: memberId,
              },
            },
          },
        });

        // File creation successfull
        logger.info({
          ...loggerMetadata,
          endpoint: "createFileForMember",
          action: "create",
          input: {
            memberId,
            year,
            courses,
            undersigner,
            signature,
          },
          message: `Dossier créé pour le membre ${member.firstname} ${member.lastname}.`,
        });
        return file.id;
      } catch (e) {
        // Gestion des erreurs Prisma et autres erreurs
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          throw new Error(
            `Il existe déjà un dossier pour ce membre et cette année.`,
          );
        } else if (e instanceof Error) {
          throw new Error(e.message); // Autres erreurs personnalisées
        } else {
          throw new Error(
            "Une erreur inconnue est survenue lors de la création du dossier.",
          );
        }
      }
    }),
  getConfirmationMailInformations: publicProcedure
    .input(z.object({ memberId: z.string().uuid(), fileId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Get all informations about registration with memberId and fileId
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
          country: true,
          postalCode: true,
          medicalComment: true,
          photo: true,
          files: {
            where: {
              id: input.fileId,
            },
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

      // Member doesn't exist
      if (!member) {
        throw new Error("Le membre n'a pas pu être inscrit.");
      }

      // Check if member is Adult or not
      const isAdult = calculateAge(member.birthdate);

      // Informations about the members
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

      // informations about legalGuardians
      const legalGuardians = member.legalGuardians.map((legalGuardian) => ({
        firstname: legalGuardian.firstname,
        lastname: legalGuardian.lastname,
        phone: legalGuardian.phone,
        mail: legalGuardian.mail,
      }));

      // Email for send registration confirmation
      let mailTo = "";
      // If member is adult, use member.mail
      if (isAdult && member.mail) {
        mailTo = member.mail;
      } else if (!isAdult) {
        // member not adult, search for legals guardians mail
        const legalGuardianWithMail = legalGuardians.find((val) => val.mail);

        // if legal guardians don't have email, using member email
        mailTo =
          legalGuardianWithMail?.mail ??
          member.mail ??
          (() => {
            throw new Error(
              "Aucun mail n'est renseigné, impossible d'envoyer la confirmation.",
            );
          })();
      } else {
        throw new Error(
          "Aucun mail n'est renseigné, impossible d'envoyer la confirmation.",
        );
      }

      // Member doesn't have file with this fileId
      if (!member.files[0]) {
        throw new Error("Aucun dossier n'a été généré pour ce membre.");
      }

      const file = member.files[0];

      // Calcul rate of his membership
      const price = file.courses.reduce((sum, course) => sum + course.price, 0);

      return {
        mailTo,
        price,
        ...memberInfo,
        legalGuardians,
        courses: file.courses.map((course) => course.name),
      };
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