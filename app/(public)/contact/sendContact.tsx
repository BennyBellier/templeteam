"use server";

import { type Result } from "@/lib/utils";
import logger from "@/server/logger";
import { sendContactMail } from "@/services/mails/contact";
import { type ContactFormInput, ContactFormSchema } from "./types";


export const send = async (
  input: ContactFormInput,
): Promise<Result<string>> => {
  const parsed = ContactFormSchema.safeParse(input);

  if (!parsed.success)
    return {
      ok: false,
      error: "Veuillez vérifier les informations saisies.",
    };

  const { name, mail, subject, message } = parsed.data;

  // Send confirmation mail
  try {
    await sendContactMail(name, mail, subject, message);
  } catch (mailErr) {
    logger.error({
      context: "ContactForm",
      step: "sendMail",
      message: `Failed to send contact mail`,
      name,
      error: mailErr,
    });
    return {
      ok: false,
      error:
        "Une erreur s'est produite lors de l'envoie du mail de confirmation. Veuillez réessayer plus tard.",
    };
  }

  return { ok: true, data: "Nous avons bien reçu votre message !" };
};
