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
  logger.info({ function: "registerMember", content: member });
  try {
    const memberId = await prisma.association.createMember({
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
    for (const lg of legalGuardians) {
      await prisma.association.createLegalGuardian({
        memberId,
        ...lg,
        mail: lg.mail === "" ? undefined : lg.mail,
      });
    }
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

    const memberFile = await prisma.association.getConfirmationMailInformations(
      { memberId, fileId },
    );

    // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
    const htmlContent = await render(RegistrationTemplate(memberFile));

    const payload = {
      from: env.REGISTER_MAIL,
      subject: `Confirmation de la pré-inscription de ${memberFile.lastname} ${memberFile.firstname}`,
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

    // Mail to member
    const sended = await transporter.sendMail({
      ...payload,
      to: memberFile.mailTo,
    });

    logger.info({
      type: "nodemailer",
      object: "RegistrationConfirmation",
      message: sended.accepted.toString(),
    });
    return sended.response;
  } catch (e) {
    if (e instanceof Error) {
      logger.error({
        type: "nodemailer",
        object: "RegistrationConfirmation",
        e,
      });
    }
    throw e;
  }
};

export {
  registerMember,
  registerLegalGuardians,
  registerFile,
  sendConfirmationMail,
};
