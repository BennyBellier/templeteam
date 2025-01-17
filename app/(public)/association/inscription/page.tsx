"use client";

import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "@/trpc/TrpcProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import Authorization from "./(StepForms)/Authorization";
import LegalGuardians from "./(StepForms)/LegalGuardians";
import Member from "./(StepForms)/Member";
import Courses from "./(StepForms)/Courses";
import { Resume } from "./StepperFormActions";
import { defineStepper } from "@stepperize/react";
import { useMediaQuery } from "usehooks-ts";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import useStore from "@/stores/useStore";
import { useRegisterFormStore } from "@/stores/registerFormStore";
import { Prisma, Gender } from "prisma/prisma-client";
import { isValidPhoneNumber } from "react-phone-number-input";

/* --------------------------------------------------------
                    Dropzones constantes
   -------------------------------------------------------- */

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 3MB

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
    .refine(
      (checkboxes) => checkboxes.filter((checked) => checked).length >= 1,
      {
        message: "Veuillez sélectionner exactement 1 cours.",
      },
    ),
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

export const MemberSchema = z.object({
  photo: z
    .array(z.instanceof(File))
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
  birthdate: z.date({ required_error: "Ce champs est obligatoire." }),
  gender: z.nativeEnum(Gender, {
    required_error: "Ce champs est obligatoire.",
  }),
  mail: z.string().email("Adresse email invalide.").nullable(),
  phone: z
    .string({ required_error: "Ce champs est obligatoire." })
    .refine(isValidPhoneNumber, { message: "Numéro de téléphone invalide." })
    .nullable(),
  address: z.string({ required_error: "Ce champs est obligatoire." }),
  city: z.string({ required_error: "Ce champs est obligatoire." }),
  postalCode: z.string({
    required_error: "Ce champs est obligatoire.",
  }),
  country: z.string({ required_error: "Ce champs est obligatoire." }),
  medicalComment: z.string().nullable(),
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
  undersigned: z.string({ required_error: "Ce champs est obligatoire." }),
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
  {
    index: 0,
    id: "courses",
    label: "Cours",
    optional: false,
    schema: CoursesSchema,
  },
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

function StepperAdvancement() {
  const stepper = useStepper();

  return (
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
  );
}

export default function Register() {
  const stepper = useStepper();
  const orientation = useMediaQuery("(max-with: 768px)");
  const [coursesQuery] = trpc.association.getCourses.useSuspenseQuery();
  const store = useStore(useRegisterFormStore.getState, (state) => state);

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema),
  });

  console.log(form.control);

  const onSubmit = (values: z.infer<typeof stepper.current.schema>) => {
    console.log(values);
    switch (stepper.current.id) {
      case "courses":
        const checkedCourses: Record<string, boolean> = coursesQuery.reduce(
          (acc, course, index) => ({
            ...acc,
            [course.name]: values.checkboxes[index],
          }),
          {},
        );
        console.log(checkedCourses);
        store.setCourses(checkedCourses);
          stepper.next();
        break;

      case "informations":
        store.setMember(values);
          stepper.next();
        break;

      case "legalGuardians":
          stepper.next();
        break;

      case "authorization":
        store.setAuthorization(values);
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
        <StepperAdvancement />
        <Form {...form}>
          <form
            id="registerForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <Card
              className={cn(
                "ease flex h-full max-w-[750px] flex-col overflow-hidden transition-transform duration-500",
              )}
            >
              {stepper.switch({
                courses: () => <Courses query={coursesQuery} />,
                /* informations: () => <Member />,
            legalGuardians: () => <LegalGuardians />,
            authorization: () => <Authorization />,
            resume: () => <Resume />, */
              })}
              <CardFooter className={cn("h-12 w-full rounded-none p-0")}>
                {stepper.isFirst || stepper.isLast ? (
                  <Button
                    // type="submit"
                    // form="registerForm"
                    className="h-full w-full rounded-b-lg rounded-l-none rounded-t-none hover:scale-100 focus-visible:scale-100 disabled:opacity-100"
                  >
                    {stepper.isFirst && "Commencer"}
                    {stepper.isLast && "Valider"}
                  </Button>
                ) : null}
              </CardFooter>
            </Card>
          </form>
        </Form>
      </LayoutSection>
    </Layout>
  );
}
