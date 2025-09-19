import logger from "@/server/logger";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { CreateFileInput, LegalGuardianInput, MemberInput } from "./types";
import { getPreviousSeason } from "@/lib/utils";

export async function getMemberByIndex(
  prisma: Prisma.TransactionClient,
  input: {
    lastname: string;
    firstname: string;
    birthdate: Date;
    mail?: string;
    phone?: string;
  },
) {
  return await prisma.member.findFirst({
    where: {
      OR: [
        {
          AND: {
            firstname: input.firstname,
            lastname: input.lastname,
            birthdate: input.birthdate,
          },
        },
        { mail: input.mail ?? undefined },
        { phone: input.phone ?? undefined },
      ],
    },
  });
}

export async function getMemberById(
  tx: Prisma.TransactionClient,
  memberId: string,
) {
  const member = await tx.member.findUnique({ where: { id: memberId } });

  if (!member) {
    logger.warn({
      context: "tRPC",
      requestPath: "createLegalGuardian",
      message: `Member ${memberId} not found.`,
    });
    throw new Error("Le membre spécifié n'existe pas.");
  }

  return member;
}

export async function upsertMember(
  tx: Prisma.TransactionClient,
  member: MemberInput,
  photo?: string,
) {
  if (!member) throw Error();

  let existingMember = await getMemberByIndex(tx, { ...member });

  if (existingMember) {
    existingMember = await tx.member.update({
      where: { id: existingMember.id },
      data: {
        mail: existingMember.mail ?? member.mail,
        phone: existingMember.phone ?? member.phone,
        address: member.address,
        city: member.city,
        postalCode: member.postalCode,
        country: member.country,
        photo,
      },
    });
  } else {
    existingMember = await tx.member.create({
      data: { ...member, photo },
    });
  }

  return existingMember;
}
export async function upsertLegalGuardian(
  tx: Prisma.TransactionClient,
  guardians: LegalGuardianInput[],
  memberId: string,
) {
  for (const lg of guardians) {
    let guardian = await tx.legalGuardian.findFirst({
      where: {
        OR: [{ phone: lg.phone }, { mail: lg.mail ?? undefined }],
      },
    });

    if (guardian) {
      guardian = await tx.legalGuardian.update({
        where: { id: guardian.id },
        data: {
          mail: guardian.mail ?? lg.mail,
          phone: guardian.phone ?? lg.phone,
        },
      });
    } else {
      guardian = await tx.legalGuardian.create({ data: lg });
    }

    // Relier au membre
    const link = await tx.member.findUnique({
      where: { id: memberId },
      select: { legalGuardians: { where: { id: guardian.id } } },
    });

    if (!link?.legalGuardians.length) {
      await tx.member.update({
        where: { id: memberId },
        data: { legalGuardians: { connect: { id: guardian.id } } },
      });
    }
  }
}

export async function checkCoursesExist(
  tx: Prisma.TransactionClient,
  courses: string[],
) {
  const coursesCheck = await tx.course.findMany({
    where: { name: { in: courses } },
  });

  if (coursesCheck.length !== courses.length) {
    const coursesFound = new Set(coursesCheck.map((c) => c.name));
    const notFound = courses.filter((c) => !coursesFound.has(c));
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Les cours suivants ne sont pas reconnus : ${notFound.join(", ")}`,
    });
  }
  return true;
}

export async function getFile(
  tx: Prisma.TransactionClient,
  season: string,
  memberId: string,
) {
  return await tx.file.findUnique({
    where: { season_memberId: { season, memberId } },
  });
}

export async function createFile(
  tx: Prisma.TransactionClient,
  input: Omit<CreateFileInput, "member" | "photo" | "legalGuardians">,
  memberId: string,
) {
  const { season, courses, undersigner, signature } = input;

  const existingFile = await getFile(tx, season, memberId);

  if (existingFile) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Un dossier existe déjà pour cette saison.",
    });
  }

  return await tx.file.create({
    data: {
      season,
      courses: {
        connect: courses.map((course) => ({
          name: course,
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
}

export async function hasPreviousSeasonFile(
  tx: Prisma.TransactionClient,
  memberId: string,
  season: string,
) {
  const previousSeason = getPreviousSeason(season);

  const file = await tx.file.findUnique({
    where: {
      season_memberId: {
        season: previousSeason,
        memberId,
      },
    },
  });

  return file !== null;
};