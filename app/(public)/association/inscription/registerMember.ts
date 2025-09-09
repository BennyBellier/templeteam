"use server";

import { env } from "@/env.mjs";
import {
  associationPath,
  getMemberPhotoPath,
  serverPath,
} from "@/server/file-manipulations";
import logger from "@/server/logger";
import smtpOptions from "@/server/mail";
import type {
  AuthorizationState,
  LegalGuardianState,
  MemberState,
} from "@/stores/registerFormStore";
import { prisma } from "@/trpc/server";
import { render } from "@react-email/components";
import RegistrationTemplate from "emails/AssociationRegistration";
import nodemailer from "nodemailer";

const registerMember = async (
  member: MemberState,
): Promise<{
  id: string;
  new: boolean;
}> => {
  try {
    const member_record = await prisma.association.createOrGetMember({
      ...member,
      mail: member.mail === "" ? undefined : member.mail,
      phone: member.phone === "" ? undefined : member.phone,
      birthdate: new Date(member.birthdate),
      medicalComment:
        member.medicalComment === "" ? undefined : member.medicalComment,
    });

    return member_record;
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
    let legalGuardian_records: {id:string, new: boolean}[] = [];

    for (const lg of legalGuardians) {
      legalGuardian_records.push(
        await prisma.association.createOrGetLegalGuardian({
          memberId,
          ...lg,
          mail: lg.mail === "" ? undefined : lg.mail,
          lastname: "",
          firstname: "",
          phone: "",
        }),
      );
    }

    return legalGuardian_records;
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

const registerValidationError = async (
  member: { id: string; new: boolean },
  fileId: string | undefined,
  legalGuardians: { id: string; new: boolean }[],
) => {
  await prisma.association.deleteMember({ member, fileId, legalGuardians });
};

export {
  registerFile,
  registerLegalGuardians,
  registerMember,
  registerValidationError,
  sendConfirmationMail,
};
