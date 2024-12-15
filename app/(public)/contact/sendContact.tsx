"use server";

import { env } from "@/env.mjs";
import smtpOptions from "@/server/mail";
import { render } from "@react-email/components";
import { type InputType } from "./contactForm";
import ContactTemplate from "emails/ContactTemplate";
import TextContactTemplate from "emails/TextContactTemplate";
import nodemailer from "nodemailer";

export const send = async (data: InputType) => {
  const transporter = nodemailer.createTransport({ ...smtpOptions });

  const sended = await transporter.sendMail({
    from: env.CONTACT_FROM_MAIL,
    to: env.CONTACT_FROM_MAIL,
    subject: data.subject,
    replyTo: data.mail,
    text: render(TextContactTemplate(data), { plainText: true }),
    html: render(ContactTemplate(data)),
  });

  console.info({ type: "mail", page: "contact", message: sended });

  return sended;
};
