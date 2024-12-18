import logger from "@/server/logger";
import { Membership } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const loggerMetadata = { type: "trpc", router: "association" };

export const AssociationRouter = createTRPCRouter({
  createMember: publicProcedure
    .input(
      z.object({
        firstname: z.string().trim(),
        lastname: z.string().trim(),
        birthdate: z.date().min(new Date(1900, 0, 1)),
        gender: z.string().trim(),
        mail: z.string().trim().optional(),
        phoneNumber: z.string().trim().optional(),
        address: z.string().trim(),
        city: z.string().trim(),
        postalCode: z.string().trim(),
        country: z.string().trim(),
        picture: z.string().trim(),
        medicalComment: z.string().trim().optional(),

        undersigner: z.string().trim(),
        signature: z.string(),

        membership: z.array(z.string().trim()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const profiler = logger.startTimer();
      const {
        firstname,
        lastname,
        birthdate,
        gender,
        mail,
        phoneNumber,
        address,
        city,
        postalCode,
        country,
        picture,
        medicalComment,
        undersigner,
        signature,
        membership,
      } = input;
      let membershipSuccess = true;

      const member = await ctx.prisma.member.create({
        data: {
          firstname,
          lastname,
          birthdate,
          gender,
          mail,
          phoneNumber,
          address,
          city,
          postalCode,
          country,
          picture,
          medicalComment,
          undersigner,
          signature,
        },
      });

      for (const element of membership) {
        if (element in Membership) {
          await ctx.prisma.memberMembership.create({
            data: {
              memberId: member.id,
              membership: element as keyof typeof Membership,
            },
          });

          membershipSuccess = true ? status !== null : false;
        }
      }

      if (member && membershipSuccess) {
        profiler.done(
          loggerMetadata && {
            endpoint: "createMember",
            message: `Succesfully added member id: ${member.id} -> ${member.lastname} ${member.firstname}`,
          },
        );
      } else {
        profiler.done(
          loggerMetadata && {
            endpoint: "createMember",
            level: "error",
            message: `${
              !member
                ? `Failed to add member ${firstname} ${lastname}.${!membershipSuccess ? "/" : ""}`
                : ""
            } ${
              !membershipSuccess
                ? `Failed to add ${JSON.stringify(membership)} to member.`
                : ""
            } `,
          },
        );
      }

      return member.id;
    }),
  createEmergencyContact: publicProcedure
    .input(
      z.object({
        name: z.string().trim(),
        phone: z.string().trim(),
        memberId: z.string().uuid(),
        level: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const profiler = logger.startTimer();
      const { memberId, level } = input;
      let emergencyContact;

      emergencyContact = await ctx.prisma.emergencyContact.findUnique({
        where: { phone: input.phone },
      });

      if (emergencyContact === null) {
        emergencyContact = await ctx.prisma.emergencyContact.create({
          data: {
            name: input.name,
            phone: input.phone,
          },
        });
      }

      const linkMemberToEmergency =
        await ctx.prisma.memberEmergencyContact.create({
          data: {
            memberId: memberId,
            emergencyContactId: emergencyContact.id,
            level: level,
          },
        });

      const contactId = emergencyContact.id;
      const linkId = linkMemberToEmergency.id;

      if (contactId && linkId) {
        profiler.done({
          router: "association",
          endpoint: "createEmergencyContact",
          message: `Successfully create emergency contact ${contactId} for member ${linkId}`,
        });
      } else {
        profiler.done({
          router: "association",
          endpoint: "createEmergencyContact",
          level: "error",
          message: `Failed to create ${input.phone} for ${memberId}`,
        });
      }

      return {
        contactId,
        linkId,
      };
    }),
  getMemberAllinformations: publicProcedure
    .input(z.object({ memberId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const profiler = logger.startTimer();
      const member = await ctx.prisma.member.findFirst({
        select: {
          firstname: true,
          lastname: true,
          birthdate: true,
          gender: true,
          mail: true,
          phoneNumber: true,
          address: true,
          city: true,
          postalCode: true,
          medicalComment: true,
          memberships: {
            select: {
              membership: true,
            },
          },
          MemberEmergencyContact: {
            select: {
              contact: {
                select: {
                  name: true,
                  phone: true,
                },
              },
            },
          },
          medicalCertificate: {
            select: {
              id: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
          picture: true,
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
        phoneNumber: member.phoneNumber,
        address: member.address,
        city: member.city,
        postalCode: member.postalCode,
        medicalComment: member.medicalComment ?? null,
        picture: member.picture ?? null,
        medicalCertificate: member.medicalCertificate[0]?.id ?? null,
        memberships: member.memberships.map((m) => m.membership),
        MemberEmergencyContact: member.MemberEmergencyContact.map(
          (emergencyContact) => ({
            name: emergencyContact.contact.name,
            phone: emergencyContact.contact.phone,
          }),
        ),
      };
    }),
  getEndofTrialsInfos: publicProcedure.query(async ({ ctx }) => {
    const member = await ctx.prisma.member.findMany({
      select: {
        id: true,
        mail: true,
        memberships: {
          select: {
            membership: true,
          },
        },
      },
    });

    if (!member) return null;

    return member.map((m) => {
      return {
        id: m.id,
        mail: m.mail,
        membership: m.memberships.map((mm) => mm.membership as string),
      };
    });
  }),
  addMemberPictureAndCertificate: publicProcedure
    .input(
      z.object({
        memberId: z.string().uuid(),
        pictureFilename: z.string(),
        certificateFilename: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const profiler = logger.startTimer();

      const updated = await ctx.prisma.member.update({
        where: {
          id: input.memberId,
        },
        data: {
          picture: input.pictureFilename,
        },
      });

      const certificate = await ctx.prisma.medicalCertificate.create({
        data: {
          id: input.certificateFilename,
          memberId: input.memberId,
        },
      });

      if (updated && certificate) {
        profiler.done(
          loggerMetadata && {
            endpoint: "addMemberPictureAndCertificate",
            message: `Succesfully updated member id: ${input.memberId} with picture named ${input.pictureFilename} and added certificate named ${input.certificateFilename}`,
          },
        );
      } else {
        profiler.done(
          loggerMetadata && {
            endpoint: "addMemberPictureAndCertificate",
            level: "error",
            message: `${
              !updated
                ? `Failed to updated member ${input.memberId} with ${input.pictureFilename}.${!certificate ? "/" : ""}`
                : ""
            } ${!certificate ? `Failed to create ${input.certificateFilename} to member ${input.memberId}.` : ""} `,
          },
        );
      }
    }),
  getMembersList: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.member.findMany({
      include: {
        memberships: true,
        MemberEmergencyContact: {
          include: { contact: true },
          orderBy: { level: "asc" },
        },
        medicalCertificate: true,
      },
      orderBy: { lastname: "asc" },
      take: 20,
    });
  }),
});
