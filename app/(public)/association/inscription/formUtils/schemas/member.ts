import { getPhoneData } from "@/components/ui/phone-input";
import { calculateAge } from "@/lib/utils";
import z from "zod";
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from "../constants";
import { Gender } from "@prisma/client";

export const MemberSchema = z
  .object({
    photo: z
      .array(z.instanceof(File), {
        invalid_type_error: "La photo est obligatoire.",
      })
      .refine((files) => files.length > 0, "La photo est obligatoire.")
      .refine((files) => {
        return files?.every((file) => file.size <= MAX_UPLOAD_SIZE);
      }, "La taille du fichier doit faire moins de 3MB.")
      .refine((files) => {
        return files?.every((file) => ACCEPTED_FILE_TYPES.includes(file.type));
      }, "Le fichier doit être de type PNG, JPEG ou TIFF."),
    firstname: z
      .string({ required_error: "Ce champs est obligatoire." })
      .trim()
      .min(1, "La saisie est incorrecte."),
    lastname: z
      .string({ required_error: "Ce champs est obligatoire." })
      .trim()
      .min(1, "La saisie est incorrecte."),
    birthdate: z
      .string({
        required_error: "Ce champs est obligatoire.",
      })
      .date()
      .refine((data) => {
        return new Date(data).getTime() < Date.now();
      }, "La date de naissance ne peux pas être dans le futur."),
    gender: z.nativeEnum(Gender, {
      required_error: "Ce champs est obligatoire.",
    }),
    mail: z.union([
      z.literal(""),
      z.string().optional(),
      z.string().email("Adresse email invalide."),
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
          message: "Numéro de téléphone invalide.",
        },
      )
      .optional(),
    address: z
      .string({ required_error: "Ce champs est obligatoire." })
      .trim()
      .min(1, "La saisie est incorrecte."),
    city: z
      .string({ required_error: "Ce champs est obligatoire." })
      .trim()
      .min(1, "La saisie est incorrecte."),
    postalCode: z
      .string({
        required_error: "Ce champs est obligatoire.",
      })
      .regex(/^\d{4,10}(-\d{4})?$/, {
        message: "Le code postal est incorrecte.",
      }),
    country: z.string({ required_error: "Ce champs est obligatoire." }),
    medicalComment: z
      .string()
      .trim()
      .max(200, { message: "Le texte est trop long." })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const age = calculateAge(data.birthdate ?? "");

    if (age >= 18 && !data.phone && !data.mail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message:
          "Le numéro de téléphone est obligatoire pour les personnes de 18 ans et plus.",
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mail"],
        message:
          "L'email est obligatoire pour les personnes de 18 ans et plus.",
      });
    }
  });