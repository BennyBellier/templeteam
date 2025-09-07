"use server";

import { env } from "@/env.mjs";
import logger from "@/server/logger";
import smtpOptions from "@/server/mail";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import RegistrationTemplate from "emails/AssociationRegistration";
import { prisma } from "@/trpc/server";
import type {
  AuthorizationState,
  LegalGuardianState,
  MemberState,
} from "@/stores/registerFormStore";
import {
  associationPath,
  getMemberPhotoPath,
  serverPath,
} from "@/server/file-manipulations";

const registerMember = async (
  member: MemberState,
): Promise<string | undefined> => {
  try {
    const memberId = await prisma.association.createOrGetMember({
      ...member,
      mail: member.mail === "" ? undefined : member.mail,
      phone: member.phone === "" ? undefined : member.phone,
      birthdate: new Date(member.birthdate),
      medicalComment:
        member.medicalComment === "" ? undefined : member.medicalComment,
    });

    return memberId;
  } catch (e) {
    throw e;
  }
};

const registerLegalGuardians = async (
  memberId: string,
  legalGuardians: LegalGuardianState[],
) => {
  try {
    // eslint-disable-next-line prefer-const
    let legalGuardiansId: string[] = [];

    for (const lg of legalGuardians) {
      legalGuardiansId.push(
        await prisma.association.createOrGetLegalGuardian({
          memberId,
          ...lg,
          mail: lg.mail === "" ? undefined : lg.mail,
        }),
      );
    }

    return legalGuardiansId;
  } catch (e) {
    throw e;
  }
};

const registerFile = async (
  memberId: string,
  courses: Record<string, boolean>,
  authorization: AuthorizationState,
) => {
  try {
    const coursesArray = Object.keys(courses)
      .map((key) => (courses[key] ? key : null))
      .filter((key): key is string => key !== null);

    const file = await prisma.association.createFileForMember({
      memberId,
      courses: coursesArray,
      undersigner: authorization.undersigner,
      signature: authorization.signature,
    });

    return file;
  } catch (e) {
    throw e;
  }
};

const sendConfirmationMail = async (memberId: string, fileId: string) => {
  try {
    // Initialize nodemailer
    const transporter = nodemailer.createTransport({ ...smtpOptions });

    transporter.verify(function (error, success) {
      if (error ?? !success) {
        logger.error({
          message: "Server can't take our messages.",
          context: "nodemailer",
          data: error,
        });
        throw new Error(
          "Nous rencontrons actuellement un problème avec notre service d'e-mail. Veuillez réessayer plus tard ou contacter notre support si le problème persiste.",
        );
      } else {
        logger.debug({
          message: "Server is ready to take our messages",
          context: "nodemailer",
        });
      }
    });

    const memberFile = await prisma.association.getConfirmationMailInformations(
      { memberId, fileId },
    );

    // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
    const htmlContent = await render(RegistrationTemplate(memberFile));

    const payload = {
      from: `Temple Team <${env.REGISTER_MAIL}>`,
      subject: `Confirmation de l'inscription de ${memberFile.lastname} ${memberFile.firstname}`,
      replyTo: env.NOREPLY_MAIL,
      html: htmlContent,
      attachments: [
        {
          path: serverPath(associationPath, "certificat_medical.pdf"),
        },
        {
          filename: memberFile.photo ?? undefined,
          path: memberFile.photo
            ? getMemberPhotoPath(memberId, memberFile.photo)
            : undefined,
          cid: memberFile.photo ? "photo" : undefined,
        },
      ],
    };

    let mailSended: string | undefined;

    // Mail to member
    transporter.sendMail(
      {
        ...payload,
        to: memberFile.mailTo,
      },
      (error, info) => {
        if (error) {
          logger.error({
            message: `Failed to send message to ${memberFile.mailTo}`,
            context: "nodemailer",
            data: error,
          });
          throw new Error(
            "Une erreur s'est produite lors de l'envoie du mail de confirmation. Veuillez réessayer plus tard ou contacter notre support si le problème persiste.",
            { cause: "RegistrationConfirmationSendMail" },
          );
        } else {
          logger.info({
            message: `Message successfully send to ${memberFile.mailTo}`,
            context: "nodemailer",
            data: info,
          });
          mailSended = info.response;
        }
      },
    );

    return mailSended;
  } catch (e) {
    if (e instanceof Error && e.cause !== "RegistrationConfirmationSendMail") {
      logger.error({
        message:
          "Error while trying to send association registration confirmation to member.",
        context: "nodemailer",
        requestId: "RegistrationConfirmation",
        data: e,
      });
    }
    throw e;
  }
};

type ID = string | undefined;

const registerValidationError = async (
  memberId: ID,
  fileId: ID,
  legalGuardiansId: string[],
) => {
  await prisma.association.deleteMember({ memberId, fileId, legalGuardiansId });
};

export {
  registerMember,
  registerLegalGuardians,
  registerFile,
  sendConfirmationMail,
  registerValidationError,
};
