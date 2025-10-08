"use server";

import { calculateAge, type Result } from "@/lib/utils";
import {
  moveFromTmpToMemberPhotoFolder,
  rmTmpFile,
} from "@/server/fs/files-manipulation";
import logger from "@/server/logger";
import { sendConfirmationMail } from "@/services/mails";
import { sendEndOfTrialsMail } from "@/services/mails/endOfTrials";
import { prisma } from "@/trpc/server";
import {
  RegisterMemberForSeasonSchema,
  type RegisterMemberForSeasonInput,
} from "./formUtils";

export const registerMemberForYear = async (
  input: RegisterMemberForSeasonInput,
): Promise<Result<string>> => {
  const parsed = RegisterMemberForSeasonSchema.safeParse(input);

  if (!parsed.success)
    return { ok: false, error: "Veuillez vérifier les informations saisies." };

  const { member, photo, legalGuardians, authorization, courseRecords } =
    parsed.data;

  if (!courseRecords || !member || !authorization) {
    return { ok: false, error: "Une étape n'a pas été remplie..." };
  }

  const isAdult = calculateAge(member.birthdate) >= 18;
  if (!isAdult && (!legalGuardians || legalGuardians.length === 0)) {
    return {
      ok: false,
      error:
        "Veuillez renseigner au moins un responsable légal pour un adhérent mineur.",
    };
  }

  try {
    // Check if not already exist file for this year for this member
    const already = await prisma.association.registration.isMemberHaveFile({
      lastname: member.lastname,
      firstname: member.firstname,
      birthdate: new Date(member.birthdate),
      mail: member.mail,
      phone: member.phone,
    });

    if (already) {
      if (photo) await rmTmpFile(photo);
      return {
        ok: false,
        error: `Il existe déjà une inscription au nom de ${member.lastname} ${member.firstname} pour cette saison.`,
      };
    }

    // Convert Courses from Record<...> to String[]
    const courses = Object.keys(courseRecords)
      .map((key) => (courseRecords[key] ? key : null))
      .filter((key): key is string => key !== null);

    // Register Member + File un DB (encapsulate)
    const { memberId } =
      await prisma.association.registration.registerMemberWithFile({
        member: { ...member, birthdate: new Date(member.birthdate) },
        photo,
        legalGuardians,
        courses,
        signature: authorization.signature,
        undersigner: authorization.undersigner,
      });

    try {
      // Move photo from tmp to member folder
      if (photo) await moveFromTmpToMemberPhotoFolder(memberId, photo);
    } catch (moveErr) {
      logger.error({
        context: "AssociationRegistration",
        step: "Move photo file",
        message: `Failed to move photo from tmp/ for member ${memberId}`,
        error: moveErr,
      });
    }

    // Send confirmation mail
    try {
      await sendConfirmationMail(memberId);
    } catch (mailErr) {
      logger.error({
        context: "AssociationRegistration",
        step: "sendMail",
        message: `Failed to send confirmation mail`,
        memberId,
        error: mailErr,
      });
      return {
        ok: false,
        error:
          "L'inscription a été enregistrée, mais l'envoi du mail a échoué. Veuillez contactez le support.",
      };
    }

    // Send confirmation mail
    try {
      await sendEndOfTrialsMail(memberId);
    } catch (mailErr) {
      logger.error({
        context: "AssociationRegistration",
        step: "sendMail",
        message: `Failed to send end of trials mail`,
        memberId,
        error: mailErr,
      });
      return {
        ok: false,
        error:
          "L'inscription a été enregistrée, mais l'envoi du mail a échoué. Veuillez contactez le support.",
      };
    }
  } catch (e) {
    logger.error({
      context: "AssociationRegistration",
      step: "global",
      message: "Failed to register member.",
      input: {
        firstname: member.firstname,
        lastname: member.lastname,
      },
      error: e,
    });

    if (photo) await rmTmpFile(photo);

    return {
      ok: false,
      error:
        "Erreur lors de l'inscription. Veuillez réessayer ou contacter le support si le problème persiste.",
    };
  }
  return { ok: true, data: "Inscription réussie !" };
};
