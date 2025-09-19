import { Gender, Prisma } from "@prisma/client";
import z from "zod";
import {
  AuthorizationSchema,
  LegalGuardianSchema,
} from "./schemas";
import { getPhoneData } from "@/components/ui/phone-input";
import { calculateAge } from "@/lib/utils";

const coursesProps = Prisma.validator<Prisma.CourseDefaultArgs>()({
  select: {
    name: true,
    description: true,
    info: true,
    sessions: {
      select: {
        id: true,
        dayOfWeek: true,
        startHour: true,
        endHour: true,
        location: {
          select: {
            place: true,
            city: true,
            postalCode: true,
            query: true,
          },
        },
      },
    },
  },
});

export type CoursesProps = Prisma.CourseGetPayload<typeof coursesProps>;

const MemberRegistrationSchema = z
  .object({
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
    mail: z
      .string()
      .email("Adresse email invalide.")
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val)),
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
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val)),
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

export const RegisterMemberForYearSchema = z.object({
  member: MemberRegistrationSchema.optional(),
  photo: z.string().optional(),
  legalGuardians: LegalGuardianSchema.array().optional(),
  authorization: AuthorizationSchema.optional(),
  courseRecords: z.record(z.boolean()).optional(),
});

export type RegisterMemberForYearInput = z.infer<
  typeof RegisterMemberForYearSchema
>;
