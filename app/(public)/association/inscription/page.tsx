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
import { calculateAge, cn, fileToBase64 } from "@/lib/utils";
import { useRegisterFormStore } from "@/stores/registerFormStore";
import { trpc } from "@/trpc/TrpcProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineStepper } from "@stepperize/react";
import { Gender } from "prisma/prisma-client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Courses from "./(StepForms)/Courses";
import Member from "./(StepForms)/Member";
import LegalGuardians from "./(StepForms)/LegalGuardians";
import Authorization from "./(StepForms)/Authorization";
import Resume from "./(StepForms)/Resume";
import { getPhoneData } from "@/components/ui/phone-input";
import { useScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";
import {registerFile, registerLegalGuardians, registerMember, sendConfirmationMail} from "./registerMember";
import { formData } from "zod-form-data";

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
  courses: z
    .boolean()
    .array()
    .refine((courses) => courses.some((checked) => checked), {
      message: "Veuillez sélectionner au moins un cours.",
    }),
});

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

export const LegalGuardiansSchema = z
  .object({
    legalGuardians: z
      .array(
        z.object({
          firstname: z
            .string({ required_error: "Ce champs est obligatoire." })
            .trim()
            .min(1, "La saisie est incorrecte."),
          lastname: z
            .string({ required_error: "Ce champs est obligatoire." })
            .trim()
            .min(1, "La saisie est incorrecte."),
          mail: z.string().email("Adresse email invalide.").optional(),
          phone: z
            .string({ required_error: "Ce champs est obligatoire." })
            .refine(
              (data) => {
                const phoneData = getPhoneData(data);
                if (
                  phoneData.nationalNumber &&
                  phoneData.nationalNumber.length > 0
                ) {
                  return phoneData.isValid && phoneData.isPossible;
                }
              },
              {
                message: "Numéro de téléphone invalide.",
              },
            ),
        }),
      )
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
  {
    index: 0,
    id: "courses",
    label: "Cours",
    schema: CoursesSchema,
  },
  {
    index: 1,
    id: "informations",
    label: "Informations",
    schema: MemberSchema,
  },
  {
    index: 2,
    id: "legalGuardians",
    label: "Responsable légaux",
    schema: LegalGuardiansSchema,
  },
  {
    index: 3,
    id: "authorization",
    label: "Autorisations",
    schema: AuthorizationSchema,
  },
  {
    index: 4,
    id: "resume",
    label: "Récapitulatif",
    schema: ResumeSchema,
  },
);

export default function Register() {
  const stepper = useStepper();
  const [coursesQuery] = trpc.association.getCourses.useSuspenseQuery();
  const store = useRegisterFormStore((state) => state);
  const { scrollTo } = useScrollArea();

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema),
    defaultValues: {
      courses: coursesQuery.map(
        (course) => store.courses?.[course.name] ?? false,
      ),
      ...store.member,
      birthdate: store.member?.birthdate ?? undefined,
      photo: null,
      country: store.member?.country ?? "France",
      legalGuardians: store.legalGuardians ?? [
        {
          firstname: undefined,
          lastname: undefined,
          phone: "",
          mail: undefined,
        },
      ],
      ...store.authorization,
      undersigner: store.authorization?.undersigner,
    },
  });

  const onSubmit = async (values: z.infer<typeof stepper.current.schema>) => {
    switch (stepper.current.id) {
      case "courses":
        const data = values as z.infer<typeof CoursesSchema>;
        const courses: Record<string, boolean> = coursesQuery.reduce(
          (acc, course, index) => ({
            ...acc,
            [course.name]: data.courses[index],
          }),
          {},
        );
        store.setCourses(courses);
        stepper.next();
        break;

      case "informations":
        const memberInfo = values as z.infer<typeof MemberSchema>;
        const firstname =
          memberInfo.firstname.trim()[0]?.toUpperCase() +
          memberInfo.firstname.trim().slice(1);
        const lastname = memberInfo.lastname.trim().toUpperCase();
        const address = memberInfo.address.trim().toUpperCase();
        const city = memberInfo.city.trim().toUpperCase();
        const postalCode = memberInfo.postalCode.trim();
        if (memberInfo.photo[0]) {
          store.setMember({
            ...memberInfo,
            photo: memberInfo.photo[0],
            firstname,
            lastname,
            address,
            city,
            postalCode,
          });

          if (calculateAge(memberInfo.birthdate) >= 18) {
            stepper.goTo("authorization");
          } else {
            stepper.next();
          }
        }
        break;

      case "legalGuardians":
        const legalGuardiansValues = values as z.infer<
          typeof LegalGuardiansSchema
        >;
        const dataLegalGuardians = legalGuardiansValues.legalGuardians.map(
          (lg) => {
            const firstname =
              lg.firstname.trim()[0]?.toUpperCase() +
              lg.firstname.trim().slice(1);
            const lastname = lg.lastname.trim().toUpperCase();
            return {
              ...lg,
              firstname,
              lastname,
            };
          },
        );
        store.setLegalGuardians(dataLegalGuardians);
        stepper.next();
        break;

      case "authorization":
        const authorizationValues = values as z.infer<
          typeof AuthorizationSchema
        >;
        store.setAuthorization({ ...authorizationValues });
        stepper.next();
        break;

      case "resume":
        let toastId = undefined;
        try {
          // Check if all required step are filled
          if (!(store.courses && store.member && store.authorization)) {
            toast.error("Une étape n'a pas été remplie...");
            return;
          }

          // Check if need to fill the legalGuardians step
          const isAdult = calculateAge(store.member.birthdate ?? "") >= 18;
          if (isAdult && !store.legalGuardians) {
            toast.error("Veuillez renseigner au moins un responsable légale !");
            return;
          }

          // Step are correctly fill
          // Inform user that we treat validation
          toastId = toast.loading("Traitement de l'inscription...");

          const memberId = await registerMember(store.member);

          console.log(memberId);

          if (!memberId) {
            toast.error("Erreur lors de l'enregistrement de l'adhérent. Veuillez réessayer.", {
              id: toastId,
              duration: 3000,
            });
            return;
          }

          // Adding photo
          const formData = new FormData();

          formData.append("memberId", memberId);
          formData.append("photo", store.member.photo);

          // Call API endpoint to store files
          const response = await fetch("/api/association.uploadPhoto", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            toast.error("Erreur lors de la sauvegarde la photo. Veuillez réessayer.", {
              id: toastId,
              duration: 3000,
            });
            return;
          }

          if (store.legalGuardians) {
            await registerLegalGuardians(memberId, store.legalGuardians);
          }

          const fileId = await registerFile(
            memberId,
            store.courses,
            store.authorization,
          );

          if (!fileId) {
            toast.error("Erreur lors de la création du dossier. Veuillez réessayer.", {
              id: toastId,
              duration: 3000,
            });
            return;
          }

          const mailResponse = await sendConfirmationMail(memberId, fileId);

          console.log(mailResponse);

          toast.success("Inscription réussie !", { id: toastId, duration: 5000 });
          store.reset();
          stepper.reset();
        } catch (e) {
          if (e instanceof Error) {
            toast.error(e.message, {
              id: toastId,
              duration: 3000,
            });
          } else {
            toast.error("Un problème est survenu. Veuillez réessayer.", {
              id: toastId,
              duration: 3000,
            });
          }
        }
        break;

      default:
        break;
    }
    scrollTo(0, 190);
  };

  const onPrev = () => {
    switch (stepper.current.id) {
      case "authorization":
        if (!store.member?.birthdate) {
          stepper.goTo("informations");
        } else if (calculateAge(store.member.birthdate) >= 18) {
          stepper.goTo("informations");
        } else {
          stepper.prev();
        }
        break;

      default:
        stepper.prev();
        break;
    }
    scrollTo(0, 190);
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
        <ol className="flex w-full gap-2 px-2 sm:px-6">
          {stepper.all.map((step, index) => {
            if (step.id === "informations") {
              return (
                <li
                  key={step.id}
                  className="relative flex w-full flex-1 flex-col gap-0.5"
                >
                  <div className="relative flex">
                    <Separator
                      className={cn(
                        "h-0.5 w-1/2 bg-border",
                        index < stepper.current.index && "bg-blue-500",
                      )}
                    />
                    <Separator
                      className={cn(
                        "h-0.5 w-1/2 bg-border",
                        index + 1 < stepper.current.index && "bg-blue-500",
                      )}
                    />
                  </div>
                  <Typography
                    as="span"
                    className="w-fit text-[0.8rem] font-light"
                  >
                    {step.label}
                  </Typography>
                </li>
              );
            } else if (step.id !== "legalGuardians") {
              return (
                <li
                  key={step.id}
                  className="relative flex w-full flex-1 flex-col gap-0.5"
                >
                  <Separator
                    className={cn(
                      "h-0.5 w-full bg-border",
                      index < stepper.current.index && "bg-blue-500",
                    )}
                  />
                  <Typography
                    as="span"
                    className="w-fit text-[0.8rem] font-light"
                  >
                    {step.label}
                  </Typography>
                </li>
              );
            }
            return null;
          })}
        </ol>
        <Form {...form}>
          <form id="registerForm" onSubmit={form.handleSubmit(onSubmit)}>
            <Card
              className={cn(
                "ease flex h-full w-full max-w-[750px] flex-col space-y-2 overflow-hidden transition-transform duration-500 sm:space-y-6",
              )}
            >
              {stepper.when("courses", () => (
                <Courses query={coursesQuery} />
              ))}
              {stepper.when("informations", () => (
                <Member />
              ))}
              {stepper.when("legalGuardians", () => (
                <LegalGuardians />
              ))}
              {stepper.when("authorization", () => (
                <Authorization />
              ))}
              {stepper.when("resume", () => (
                <Resume />
              ))}
              <CardFooter className={cn("mt-0 h-12 w-full rounded-none p-0")}>
                {!stepper.isFirst && (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      onPrev();
                    }}
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
