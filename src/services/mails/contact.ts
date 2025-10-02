// services/mails/registration.ts
import "server-only";

import { env } from "@/env.mjs";
import logger from "@/server/logger";
import MailService from "@/server/mailer";
import { render } from "@react-email/render";
import ContactTemplate from "emails/ContactTemplate";
import TextContactTemplate from "emails/TextContactTemplate";

export async function sendContactMail(
  name: string,
  mail: string,
  subject: string,
  msg: string,
) {
  const data = { name, mail, subject, message: msg };
  const htmlContent = await render(ContactTemplate(data));
  const textContent = await render(TextContactTemplate(data), {
    plainText: true,
  });

  const payload = {
    from: `Temple Team <${env.CONTACT_FROM_MAIL}>`,
    to: env.CONTACT_FROM_MAIL,
    subject,
    replyTo: mail,
    html: htmlContent,
    text: textContent,
  };

  try {
    const mailService = new MailService();

    const info = await mailService.send(payload);

    return info.response;
  } catch (error) {
    logger.error({
      context: "mailer",
      procedure: "sendContactMail",
      message: `Failed to send Contact message from ${name} (${mail}) form`,
      data: error,
    });
    throw new Error("Erreur lors de l'envoi du mail de contact", {
      cause: error,
    });
  }
}
