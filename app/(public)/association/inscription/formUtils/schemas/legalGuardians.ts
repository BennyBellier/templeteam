import { getPhoneData } from "@/components/ui/phone-input";
import z from "zod";

export const LegalGuardianSchema = z.object({
  firstname: z
    .string({ required_error: "Ce champs est obligatoire." })
    .trim()
    .min(1, "La saisie est incorrecte."),
  lastname: z
    .string({ required_error: "Ce champs est obligatoire." })
    .trim()
    .min(1, "La saisie est incorrecte."),
  mail: z.string().email("Adresse email invalide.").optional(),
  phone: z.string({ required_error: "Ce champs est obligatoire." }).refine(
    (data) => {
      const phoneData = getPhoneData(data);
      if (phoneData.nationalNumber && phoneData.nationalNumber.length > 0) {
        return phoneData.isValid && phoneData.isPossible;
      }
    },
    {
      message: "Numéro de téléphone invalide.",
    },
  ),
});

export const LegalGuardiansSchema = z
  .object({
    legalGuardians: z
      .array(LegalGuardianSchema)
      .min(1, "Au moins un responsable légal est requis.")
      .max(2, "Maximum 2 responsables légaux possibles."),
  })
  .superRefine((data, ctx) => {
    if (!data.legalGuardians.some((value) => value.mail)) {
      for (let index = 0; index < data.legalGuardians.length; index++) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [`legalGuardians.${index}.mail`],
          message: "Au moins 1 email doit être renseignée.",
        });
      }
    }
  })
  .superRefine((data, ctx) => {
    const phones = data.legalGuardians.map((lg) => lg.phone);
    if (phones.length !== new Set(phones).size) {
      for (let index = 0; index < data.legalGuardians.length; index++) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [`legalGuardians.${index}.phone`],
          message:
            "Le même numéro de téléphone ne peux pas être utilisé 2 fois.",
        });
      }
    }
  });
