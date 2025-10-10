"use server";

import { type Result } from "@/lib/utils";
import logger from "@/server/logger";
import { sendConfirmationMail } from "@/services/mails";
import { sendEndOfTrialsMail } from "@/services/mails/endOfTrials";
import z from "zod";

const sendEmailSchema = z.object({
  type: z.literal(["confirmationRegistration", "EndOfTrials"]),
  memberId: z.uuidv4(),
});

type sendEmailProps = z.infer<typeof sendEmailSchema>;

export async function sendEmail(
  input: sendEmailProps,
): Promise<Result<string>> {
  const parsed = sendEmailSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: "Une erreur s'est produite veuillez réessayer" };
  }

  const { type, memberId } = parsed.data;

  try {
    switch (type) {
      case "confirmationRegistration":
        await sendConfirmationMail(memberId);
        break;

      case "EndOfTrials":
        await sendEndOfTrialsMail(memberId);
        break;
    }
  } catch (mailErr) {
    logger.error({
      context: "AdminMember",
      step: "sendMails",
      message: `Failed to send mail`,
      input,
      error: mailErr,
    });
    return {
      ok: false,
      error: "Échec lors de l'envoie du mail.",
    };
  }

  return { ok: true, data: "Email envoyé !" };
}
