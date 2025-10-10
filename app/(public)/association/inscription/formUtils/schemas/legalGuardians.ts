import { getPhoneData } from "@/components/ui/phone-input";
import z from "zod";

export const LegalGuardianSchema = z.object({
  firstname: z
    .string({
        error: (issue) => issue.input === undefined ? "Ce champs est obligatoire." : undefined
    })
    .trim()
    .min(1, "La saisie est incorrecte."),
  lastname: z
    .string({
        error: (issue) => issue.input === undefined ? "Ce champs est obligatoire." : undefined
    })
    .trim()
    .min(1, "La saisie est incorrecte."),
  mail: z.email("Adresse email invalide.").optional(),
  phone: z.string({
      error: (issue) => issue.input === undefined ? "Ce champs est obligatoire." : undefined
}).refine(
    (data) => {
      const phoneData = getPhoneData(data);
      if (phoneData.nationalNumber && phoneData.nationalNumber.length > 0) {
        return phoneData.isValid && phoneData.isPossible;
      }
    },
    {
        error: "Numéro de téléphone invalide."
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
          code: "custom",
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
          code: "custom",
          path: [`legalGuardians.${index}.phone`],
          message:
            "Le même numéro de téléphone ne peux pas être utilisé 2 fois.",
        });
      }
    }
  });
