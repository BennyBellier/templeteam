import { env } from "@/env.mjs";
import { phoneRegex } from "@/lib/utils";
import { Gender } from "@prisma/client";
import { z } from "zod";

export const seasonSchema = z
  .string()
  .regex(/^\d{4}\/\d{4}$/)
  .optional()
  .default(env.FILE_SEASON);

export const isMemberHaveFileSchema = z.object({
  lastname: z.string().trim().toUpperCase(),
  firstname: z
    .string()
    .trim()
    .transform((value) => value[0]?.toUpperCase() + value.slice(1)),
  birthdate: z
    .date()
    .min(new Date(1970, 1, 1))
    .max(new Date()),
  mail: z.string().trim().email().optional(),
  phone: z.string().trim().regex(phoneRegex).optional(),
  season: seasonSchema,
});

export const MemberSchema = z.object({
  lastname: z.string().trim().toUpperCase(),
  firstname: z
    .string()
    .trim()
    .transform((value) => value[0]?.toUpperCase() + value.slice(1)),
  birthdate: z
    .date()
    .min(new Date(1970, 1, 1))
    .max(new Date()),
  gender: z.nativeEnum(Gender),
  mail: z.string().trim().email().optional(),
  phone: z.string().trim().regex(phoneRegex).optional(),
  address: z.string().trim(),
  city: z.string().trim().toUpperCase(),
  postalCode: z.string().trim(),
  country: z.string().trim().toUpperCase(),
  medicalComment: z.string().trim().optional(),
});

export type MemberInput = z.infer<typeof MemberSchema>;

export const LegalGuardianSchema = z.object({
  firstname: z
    .string()
    .trim()
    .transform((value) => value[0]?.toUpperCase() + value.slice(1)),
  lastname: z.string().trim().toUpperCase(),
  phone: z.string().trim().regex(phoneRegex, "Numéro de téléphone invalide."),
  mail: z.string().email("Adresse e-mail invalide.").optional(),
});

export type LegalGuardianInput = z.infer<typeof LegalGuardianSchema>;

export const CreateFileInputSchema = z.object({
  member: MemberSchema,
  legalGuardians: z.array(LegalGuardianSchema).optional(),
  photo: z.string().optional(),
  season: seasonSchema,
  courses: z.array(z.string()),
  undersigner: z.string().trim(),
  signature: z.string(),
});

export type CreateFileInput = z.infer<typeof CreateFileInputSchema>;
