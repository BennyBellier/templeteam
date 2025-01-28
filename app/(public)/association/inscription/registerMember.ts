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
import { associationPath, serverPath } from "@/server/file-manipulations";

const registerMember = async (
  member: MemberState,
): Promise<string | undefined> => {
  try {
    const memberId = await prisma.association.createMember({
      ...member,
      birthdate: new Date(member.birthdate),
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
      await prisma.association.createLegalGuardian({ memberId, ...lg });
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

const sendConfirmationMail = async (
  memberId: string,
  fileId: string
) => {
  try {
    // Initialize nodemailer
    const transporter = nodemailer.createTransport({ ...smtpOptions });

    //TODO memberFile.mail = member.mail ?? legalGuardian.mail
    const memberFile = await prisma.association.getConfirmationMailInformations({memberId, fileId});

    const payload = {
      from: env.REGISTER_MAIL,
      subject: `Confirmation de la pré-inscription de ${memberFile.lastname} ${memberFile.firstname}`,
      replyTo: env.NOREPLY_MAIL,
      html: render(RegistrationTemplate(memberFile)),
      attachments: [
        {
          path: serverPath(associationPath, "certificat_medical.pdf"),
        },
      ],
    };

    // Mail to member
    const sended = await transporter.sendMail({
      ...payload,
      to: memberFile.mailTo,
    });

  } catch (e) {
    throw e;
  }
};

export {
  registerMember,
  registerLegalGuardians,
  registerFile,
  sendConfirmationMail,
};
