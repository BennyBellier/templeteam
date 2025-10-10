import { getPhoneData } from "@/components/ui/phone-input";
import { calculateAge } from "@/lib/utils";
import z from "zod";
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from "../constants";
import { Gender } from "@prisma/client";

export const MemberSchema = z
  .object({
    photo: z
      .array(z.instanceof(File), {
          error: (issue) => issue.input === undefined ? undefined : "La photo est obligatoire."
    })
      .refine((files) => files.length > 0, "La photo est obligatoire.")
      .refine((files) => {
        return files?.every((file) => file.size <= MAX_UPLOAD_SIZE);
      }, "La taille du fichier doit faire moins de 3MB.")
      .refine((files) => {
        return files?.every((file) => ACCEPTED_FILE_TYPES.includes(file.type));
      }, "Le fichier doit être de type PNG, JPEG ou TIFF."),
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
    birthdate: z.iso.date()
      .refine((data) => {
        return new Date(data).getTime() < Date.now();
      }, "La date de naissance ne peux pas être dans le futur."),
    gender: z.enum(Gender, {
        error: (issue) => issue.input === undefined ? "Ce champs est obligatoire." : undefined
    }),
    mail: z.union([
      z.literal(""),
      z.string().optional(),
      z.email("Adresse email invalide."),
    ]),
    phone: z
      .string()
      .refine(
        (data) => {
          const phoneData = getPhoneData(data);
          if (phoneData.nationalNumber && phoneData.nationalNumber.length > 0) {
            return phoneData.isValid && phoneData.isPossible;
          }
          return true;
        },
        {
            error: "Numéro de téléphone invalide."
        },
      )
      .optional(),
    address: z
      .string({
          error: (issue) => issue.input === undefined ? "Ce champs est obligatoire." : undefined
    })
      .trim()
      .min(1, "La saisie est incorrecte."),
    city: z
      .string({
          error: (issue) => issue.input === undefined ? "Ce champs est obligatoire." : undefined
    })
      .trim()
      .min(1, "La saisie est incorrecte."),
    postalCode: z
      .string({
          error: (issue) => issue.input === undefined ? "Ce champs est obligatoire." : undefined
    })
      .regex(/^\d{4,10}(-\d{4})?$/, {
          error: "Le code postal est incorrecte."
    }),
    country: z.string({
        error: (issue) => issue.input === undefined ? "Ce champs est obligatoire." : undefined
    }),
    medicalComment: z
      .string()
      .trim()
      .max(200, {
          error: "Le texte est trop long."
    })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const age = calculateAge(data.birthdate ?? "");

    if (age >= 18 && !data.phone && !data.mail) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message:
          "Le numéro de téléphone est obligatoire pour les personnes de 18 ans et plus.",
      });

      ctx.addIssue({
        code: "custom",
        path: ["mail"],
        message:
          "L'email est obligatoire pour les personnes de 18 ans et plus.",
      });
    }
  });