import { getPhoneData } from "@/components/ui/phone-input";
import { calculateAge } from "@/lib/utils";
import { Gender, Prisma } from "@prisma/client";
import z from "zod";
import { AuthorizationSchema, LegalGuardianSchema } from "./schemas";

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
    mail: z.email("Adresse email invalide.")
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
            error: "Numéro de téléphone invalide."
        },
      )
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val)),
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

export const RegisterMemberForSeasonSchema = z.object({
  member: MemberRegistrationSchema.optional(),
  photo: z.string().optional(),
  legalGuardians: LegalGuardianSchema.array().optional(),
  authorization: AuthorizationSchema.optional(),
  courseRecords: z.record(z.string(), z.boolean()).optional(),
});

export type RegisterMemberForSeasonInput = z.infer<
  typeof RegisterMemberForSeasonSchema
>;
