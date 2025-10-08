// services/mails/endOfTrials.ts
import "server-only";

import logger from "@/server/logger";
import MailService from "@/server/mailer";
import { render } from "@react-email/render";
import EndOfTrialTemplate from "emails/EndOfTrials";
import { prisma } from "@/trpc/server";
import { env } from "@/env.mjs";

export async function sendEndOfTrailsMail(memberId: string) {
  // Retrieve contact mail 
  const mailTo = await prisma.association.mail.getMemberContactMail({ memberId });

  // Retrieve mail data and generate HtmlContent
  const data = await prisma.association.mail.getEndOfTrialsForMember({
    memberId,
  });
  const htmlContent = await render(EndOfTrialTemplate({...data, memberId}));

  // Generate payload
  const payload = {
      from: `Temple Team <${env.REGISTER_MAIL}>`,
      to: mailTo,
      subject: `Fin des cours d'essaie, cotisation, règlement !`,
      replyTo: env.NOREPLY_MAIL,
      html: htmlContent,
    };

  try {
    const mailService = new MailService();

    const info = await mailService.send(payload);

    return info.response;
  } catch (error) {
    logger.error({
      context: "mailer",
      procedure: "sendEndOfTrailsMail",
      message: `Failed to send message to ${mailTo}`,
      data: error,
    });
    throw new Error("Erreur lors de l'envoi du mail de confirmation", {
      cause: error,
    });
  }
}
