"use server";

import logger from "@/server/logger";
import { sendEndOfTrialsMail } from "@/services/mails/endOfTrials";

interface Member {
  id: string;
  name: string;
  mail: string | null;
  courses: string[];
}

export async function sendEmailsToAllMembers(members: Member[]) {
  await Promise.all(
    members.map(async (member) => {
      try {
        await sendEndOfTrialsMail(member.id);
      } catch (mailErr) {
        logger.error({
          context: "AdminMailer",
          step: "sendMails",
          message: `Failed to send end of trials mail`,
          member,
          error: mailErr,
        });
      }
    }),
  );
}
