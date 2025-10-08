"use server";

import { type Result } from "@/lib/utils";
import { moveFromTmpToMemberFileMedicFolder, rmTmpFile } from "@/server/fs";
import logger from "@/server/logger";
import { prisma } from "@/trpc/server";
import z from "zod";

const uploadMedicalCertificateForMemberSchema = z.object({
  memberId: z.string().uuid(),
  medic_filename: z.string(),
});

export const uploadMedicalCertificateForMember = async (
  input: z.infer<typeof uploadMedicalCertificateForMemberSchema>,
): Promise<Result<string>> => {
  const parsed = uploadMedicalCertificateForMemberSchema.safeParse(input);

  if (!parsed.success)
    return { ok: false, error: "Veuillez vérifier les informations saisies." };

  const { memberId, medic_filename } = parsed.data;

  try {
    await prisma.association.registration.addMemberMedicalFileForSeason({
      memberId,
      medic_filename,
    });

    try {
      await moveFromTmpToMemberFileMedicFolder(memberId, medic_filename);
    } catch (moveErr) {
      logger.error({
        context: "uploadMedicalCertificate",
        step: "Move medic file",
        message: `Failed to move medic from tmp/ for member ${memberId}`,
        error: moveErr,
      });
      return {
        ok: false,
        error:
          "Une erreur s'est produite lors de l'enregistrement du document. Veuillez réessayer ou contacter le support.",
      };
    }
  } catch (medicErr) {
    logger.error({
      context: "uploadMedicalCertificate",
      step: "Save medic filename in member file",
      message: `Failed save medic filename ${medic_filename} for member id ${medic_filename}`,
      error: medicErr,
    });

    if (medic_filename) await rmTmpFile(medic_filename);

    return {
      ok: false,
      error:
        "Une erreur s'est produite lors de l'enregistrement du document. Veuillez réessayer ou contacter le support.",
    };
  }

  return { ok: true, data: "Certificat médicale enregistrer avec succés." };
};
