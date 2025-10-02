import "server-only";

import { env } from "@/env.mjs";
import nodemailer from "nodemailer";
import logger from "@/server/logger";

export const smtpOptions = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport({ ...smtpOptions });

class MailService {
  async verifyConnection() {
    try {
      await transporter.verify();
      logger.debug({
        message: "Mail server is ready to take messages",
        context: "mail",
      });
    } catch (err) {
      logger.error({
        message: "Mail server unavailable",
        context: "mail",
        data: err,
      });
      throw new Error("Service mail indisponible", { cause: err });
    }
  }

  async send(payload: nodemailer.SendMailOptions) {
    try {
      await this.verifyConnection();

      const info = await transporter.sendMail(payload);
      logger.info({
        context: "mail",
        message: `Mail successfully sent`,
        to: payload.to,
        info,
      });
      return info;
    } catch (err) {
      logger.error({
        context: "mail",
        message: `Failed to send mail`,
        to: payload.to,
        error: err,
      });
      throw new Error("Erreur lors de l'envoi du mail", { cause: err });
    }
  }
}

export default MailService;
