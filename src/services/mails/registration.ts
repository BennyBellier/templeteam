// services/mails/registration.ts
import "server-only";

import { env } from "@/env.mjs";
import { associationPath, getMemberPhotoPath, serverPath } from "@/server/file";
import logger from "@/server/logger";
import MailService from "@/server/mailer";
import { prisma } from "@/trpc/server";
import { render } from "@react-email/render";
import RegistrationTemplate from "emails/AssociationRegistration";

export async function sendConfirmationMail(memberId: string) {
  const memberFile =
    await prisma.association.registration.getConfirmationMailInformationsForSeason({
      memberId,
    });

  const htmlContent = await render(RegistrationTemplate(memberFile));

  const payload = {
    from: `Temple Team <${env.REGISTER_MAIL}>`,
    to: memberFile.mailTo,
    subject: `Confirmation de l'inscription de ${memberFile.lastname} ${memberFile.firstname}`,
    replyTo: env.NOREPLY_MAIL,
    html: htmlContent,
    attachments: [
      {
        path: serverPath(associationPath, "certificat_medical.pdf"),
      },
      memberFile.photo
        ? {
            filename: memberFile.photo,
            path: getMemberPhotoPath(memberId, memberFile.photo),
            cid: "photo",
          }
        : {},
    ],
  };

  try {
    const mailService = new MailService();

    const info = await mailService.send(payload);

    return info.response;
  } catch (error) {
    logger.error({
      context: "mailer",
      procedure: "sendConfirmationMail",
      message: `Failed to send message to ${memberFile.mailTo}`,
      data: error,
    });
    throw new Error("Erreur lors de l'envoi du mail de confirmation", {
      cause: error,
    });
  }
}
