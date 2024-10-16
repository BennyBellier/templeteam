"use server";

import smtpOptions from "@/server/mail";
import { render } from "@react-email/components";
import { type EndOfTrialsProps } from "emails/utils";
import EndOfTrialTemplate from "emails/EndOfTrials";
import nodemailer from "nodemailer";
import { env } from "@/env.mjs";

export const send = async (mail: string, data: EndOfTrialsProps) => {
  const transporter = nodemailer.createTransport({ ...smtpOptions });

  const sended = await transporter.sendMail({
    from: env.REGISTER_MAIL,
    to: mail,
    subject: "Fin des cours d'essaies !",
    replyTo: "inscription.templeteam.fr",
    html: render(EndOfTrialTemplate(data)),
  });

  await transporter.sendMail({
    from: env.REGISTER_MAIL,
    to: env.REGISTER_MAIL,
    subject: "Fin des cours d'essaies !",
    replyTo: "inscription.templeteam.fr",
    html: render(EndOfTrialTemplate(data)),
  });

  console.info({ type: "mail", page: "tmp", to: mail, message: sended });

  return sended;
};
