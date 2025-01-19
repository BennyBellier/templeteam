"use client";

import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { calculateAge, cn } from "@/lib/utils";
import { useRegisterFormStore } from "@/stores/registerFormStore";
import useStore from "@/stores/useStore";
import { trpc } from "@/trpc/TrpcProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineStepper } from "@stepperize/react";
import { Gender, Prisma } from "prisma/prisma-client";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";
import Courses from "./(StepForms)/Courses";
import Member from "./(StepForms)/Member";
import { getPhoneData } from "@/components/ui/phone-input";

/* --------------------------------------------------------
                    Dropzones constantes
   -------------------------------------------------------- */

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB

// Third form dropzone
const ACCEPTED_FILE_TYPES = [
  "image/jpeg", // JPEG
  "image/png", // PNG
  "image/tiff", // TIFF
];

/* --------------------------------------------------------
 *                          Schema
   -------------------------------------------------------- */

export const CoursesSchema = z.object({
  checkboxes: z
    .array(z.boolean())
    .refine((checkboxes) => checkboxes.some((checked) => checked), {
      message: "Veuillez sélectionner au moins un cours.",
    }),
});

const memberWithoutPhoto = Prisma.validator<Prisma.MemberDefaultArgs>()({
  omit: {
    id: true,
    birthdate: true,
    photo: true,
    createdAt: true,
    updatedAt: true,
  },
});

export const MemberSchema = z
  .object({
    photo: z
      .array(z.instanceof(File), { message: "Ce champs est obligatoire." })
      .refine((files) => files.length > 0, "La photo est obligatoire.")
      .refine((files) => {
        return files?.every((file) => file.size <= MAX_UPLOAD_SIZE);
      }, "La taille du fichier doit faire moins de 3MB.")
      .refine((files) => {
        return files?.every((file) => ACCEPTED_FILE_TYPES.includes(file.type));
      }, "Le fichier doit être de type PNG, JPEG ou TIFF.")
      .nullable(),
    firstname: z.string({ required_error: "Ce champs est obligatoire." }),
    lastname: z.string({ required_error: "Ce champs est obligatoire." }),
    birthdate: z
      .date({
        message: "Ce champs est obligatoire.",
        required_error: "Ce champs est obligatoire.",
        invalid_type_error: "la date est incorrecte.",
      })
      .max(new Date(), {
        message: "La date de naissance ne peux pas être dans le futur.",
      }),
    gender: z.nativeEnum(Gender, {
      required_error: "Ce champs est obligatoire.",
    }),
    mail: z.string().email("Adresse email invalide.").nullable(),
    phone: z
      .string()
      .refine(
        (data) => {
          const phoneData = getPhoneData(data);
          return phoneData.isValid && phoneData.isPossible;
        },
        {
          message: "Numéro de téléphone invalide.",
        },
      )
      .nullable(),
    address: z.string({ required_error: "Ce champs est obligatoire." }),
    city: z.string({ required_error: "Ce champs est obligatoire." }),
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
      .max(200, { message: "Le texte est trop long." })
      .nullable(),
  })
  .superRefine((data, ctx) => {
    const age = calculateAge(new Date(data.birthdate ?? ""));

    if (age >= 18 && !data.phone && !data.mail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mail"],
        message:
          "L'email et le numéro de téléphone sont obligatoires pour les personnes de 18 ans et plus.",
      });
    }
  }) satisfies z.Schema<Prisma.MemberGetPayload<typeof memberWithoutPhoto>>;

const legalGuardians = Prisma.validator<Prisma.LegalGuardianDefaultArgs>()({
  omit: {
    id: true,
    createdAt: true,
    updatedAt: true,
  },
});

export const LegalGuardiansSchema = z.array(
  z.object({
    firstname: z.string({ required_error: "Ce champs est obligatoire." }),
    lastname: z.string({ required_error: "Ce champs est obligatoire." }),
    mail: z.string().email("Adresse email invalide.").nullable(),
    phone: z
      .string({ required_error: "Ce champs est obligatoire." })
      .refine(isValidPhoneNumber, { message: "Numéro de téléphone invalide." }),
  }),
) satisfies z.Schema<Prisma.LegalGuardianGetPayload<typeof legalGuardians>[]>;

export const AuthorizationSchema = z.object({
  undersigner: z.string({ required_error: "Ce champs est obligatoire." }),
  emergencyAuthorization: z
    .boolean()
    .refine((value) => value, "Ce champs est obligatoire."),
  travelAuthorization: z
    .boolean()
    .refine((value) => value, "Ce champs est obligatoire."),
  imageRights: z
    .boolean()
    .refine((value) => value, "Ce champs est obligatoire."),
  theftLossLiability: z
    .boolean()
    .refine((value) => value, "Ce champs est obligatoire."),
  refund: z.boolean().refine((value) => value, "Ce champs est obligatoire."),
  internalRules: z
    .boolean()
    .refine((value) => value, "Ce champs est obligatoire."),
  signature: z.string({ required_error: "La signature est obligatoire." }),
});

export const ResumeSchema = z.object({});

/* --------------------------------------------------------
 *                          Stepper definition
   -------------------------------------------------------- */

const { useStepper } = defineStepper(
  /* {
    index: 0,
    id: "courses",
    label: "Cours",
    optional: false,
    schema: CoursesSchema,
  }, */
  {
    index: 1,
    id: "informations",
    label: "Informations",
    optional: false,
    schema: MemberSchema,
  },
  {
    index: 2,
    id: "legalGuardians",
    label: "Responsable légaux",
    optional: true,
    schema: LegalGuardiansSchema,
  },
  {
    index: 3,
    id: "authorization",
    label: "Autorisations",
    optional: false,
    schema: AuthorizationSchema,
  },
  {
    index: 4,
    id: "resume",
    label: "Récapitulatif",
    optional: false,
    schema: ResumeSchema,
  },
);

export default function Register() {
  const stepper = useStepper();
  const orientation = useMediaQuery("(max-with: 768px)");
  const [coursesQuery] = trpc.association.getCourses.useSuspenseQuery();
  const store = useStore(useRegisterFormStore.getState, (state) => state);

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema),
    defaultValues: {
      checkboxes: coursesQuery.map(
        (course) => store.courses?.[course.name] ?? false,
      ),
      ...store.member,
      medicalComment: store.member?.medicalComment ?? null,
      country: store.member?.country ?? "France",
    },
  });

  const onSubmit = (values: z.infer<typeof stepper.current.schema>) => {
    console.log(stepper.current.id);
    switch (stepper.current.id) {
      case "courses":
        const coursesValues = values as z.infer<typeof CoursesSchema>;
        const checkedCourses: Record<string, boolean> = coursesQuery.reduce(
          (acc, course, index) => ({
            ...acc,
            [course.name]: coursesValues.checkboxes[index],
          }),
          {},
        );
        store.setCourses(checkedCourses);
        stepper.next();
        break;

      case "informations":
        const membersInfo = values as z.infer<typeof MemberSchema>;
        const image: File | null = membersInfo.photo?.[0] ?? null;
        store.setMember({ ...membersInfo, photo: image });
        console.log(store.member);
        stepper.next();
        break;

      case "legalGuardians":
        const legalGuardiansValues = values as z.infer<
          typeof LegalGuardiansSchema
        >;
        store.setLegalGuardians(legalGuardiansValues);
        stepper.next();
        break;

      case "authorization":
        const authorizationValues = values as z.infer<
          typeof AuthorizationSchema
        >;
        store.setAuthorization(authorizationValues);
        stepper.next();
        break;

      case "resume":
        stepper.reset();
        break;

      default:
        break;
    }
  };

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Inscription</LayoutTitle>
        <LayoutDescription>
          Vous souhaitez participez à nos cours, inscrivez-vous dès maintenant !
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="gap-6">
        <ol className="flex w-full gap-2">
          {stepper.all.map((step, index) => (
            <li key={step.id} className="flex w-full flex-1 flex-col gap-0.5">
              <Separator
                className={cn(
                  "h-0.5 w-full bg-border",
                  index < stepper.current.index && "bg-blue-500",
                )}
              />
              <Typography as="span" className="w-fit text-[0.8rem] font-light">
                {step.label}
              </Typography>
              {step.optional && (
                <Typography as="span" variant="muted" className="w-fit text-xs">
                  optionel
                </Typography>
              )}
            </li>
          ))}
        </ol>
        <Form {...form}>
          <form id="registerForm" onSubmit={form.handleSubmit(onSubmit)}>
            <Card
              className={cn(
                "ease flex h-full w-full max-w-[750px] flex-col space-y-6 overflow-hidden transition-transform duration-500",
              )}
            >
              {stepper.switch({
                courses: () => <Courses query={coursesQuery} />,
                informations: () => <Member />,
                /*legalGuardians: () => <LegalGuardians />,
            authorization: () => <Authorization />,
            resume: () => <Resume />, */
              })}
              <CardFooter className={cn("h-12 w-full rounded-none p-0")}>
                {!stepper.isFirst && (
                  <Button
                    onClick={stepper.prev}
                    variant="secondary"
                    className="h-full w-full rounded-b-lg rounded-l-none rounded-t-none hover:scale-100 focus-visible:scale-100 disabled:opacity-100"
                  >
                    Precédent
                  </Button>
                )}
                <Button
                  type="submit"
                  form="registerForm"
                  className="h-full w-full rounded-b-lg rounded-l-none rounded-t-none hover:scale-100 focus-visible:scale-100 disabled:opacity-100"
                >
                  {stepper.isFirst && "Commencer"}
                  {stepper.isLast && "Valider"}
                  {!(stepper.isFirst || stepper.isLast) && "Suivant"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </LayoutSection>
    </Layout>
  );
}
