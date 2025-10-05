// services/mails/registration.ts
import "server-only";

import { env } from "@/env.mjs";
import logger from "@/server/logger";
import MailService from "@/server/mailer";
import { prisma } from "@/trpc/server";
import { render } from "@react-email/render";
import RegistrationTemplate from "emails/AssociationRegistration";
import { paths, STATIC_FILES } from "@/server/fs/paths";

export async function sendConfirmationMail(memberId: string) {
  const memberFile =
    await prisma.association.registration.getConfirmationMailInformationsForSeason(
      {
        memberId,
      },
    );

  const htmlContent = await render(RegistrationTemplate(memberFile));

  const payload = {
    from: `Temple Team <${env.REGISTER_MAIL}>`,
    to: memberFile.mailTo,
    subject: `Confirmation de l'inscription de ${memberFile.lastname} ${memberFile.firstname}`,
    replyTo: env.NOREPLY_MAIL,
    html: htmlContent,
    attachments: [
      {
        path: STATIC_FILES.certificatMedical.server,
      },
      memberFile.photo
        ? {
            filename: memberFile.photo,
            path: paths.members.photos(memberId).server(memberFile.photo),
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
