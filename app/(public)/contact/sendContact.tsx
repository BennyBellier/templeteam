"use server";

import { env } from "@/env.mjs";
import smtpOptions from "@/server/mail";
import { render } from "@react-email/components";
import { type InputType } from "./contactForm";
import ContactTemplate from "emails/ContactTemplate";
import TextContactTemplate from "emails/TextContactTemplate";
import logger from "@/server/logger";
import nodemailer from "nodemailer";

export const send = async (
  data: InputType,
) => {
  try {
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

    let mailSended: string | undefined;

    transporter.sendMail(
      {
        from: `Temple Team <env.CONTACT_FROM_MAIL>`,
        to: env.CONTACT_FROM_MAIL,
        subject: data.subject,
        replyTo: data.mail,
        text: await render(TextContactTemplate(data), { plainText: true }),
        html: await render(ContactTemplate(data)),
      },
      (error, info) => {
        if (error) {
          logger.error({
            message: `Failed to send contact message`,
            context: "nodemailer",
            data: error,
          });
          throw new Error(
            "Une erreur s'est produite lors de l'envoie du mail de confirmation. Veuillez réessayer plus tard ou contacter notre support si le problème persiste.",
            { cause: "ContactSendMail" },
          );
        } else {
          logger.info({
            message: "Message successfully send",
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
        message: "Error while trying to send contact message.",
        context: "nodemailer",
        requestId: "ContactSendMail",
        data: e,
      });
    }
    throw e;
  }
};
