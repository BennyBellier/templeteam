"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, PhoneInput } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStepper } from "@/components/ui/stepper";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useRegisterFormStore } from "@/providers/RegisterFormProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { FormCard } from "./formCard";

const inputClass = cn("bg-background object-bottom");

type LocalisationProps = {
  place: string;
  city: string;
  postalCode: string;
  locationQuery: { apple: string; google: string };
};

function Localisation({
  place,
  city,
  postalCode,
  locationQuery,
}: LocalisationProps) {
  const isMac =
    typeof window !== "undefined"
      ? navigator.userAgent.toUpperCase().indexOf("MAC") >= 0
      : false;

  return (
    <div className="col-start-2 row-span-2 row-start-1 flex w-full flex-col items-center justify-center gap-1">
      {isMac ? (
        <Link href={`http://maps.apple.com/?${locationQuery.apple}`}>
          <Image
            src="/img/icon/apple_map_icon.png"
            alt="Bouton d'actions rapide apple maps"
            width="64"
            height="64"
            className="w-16 object-contain "
          />
        </Link>
      ) : (
        <Link
          href={`https://www.google.com/maps/search/?api=1&${locationQuery.google}`}
          className="w-14"
        >
          <Image
            src="/img/icon/google_map_icon.png"
            alt="Bouton d'actions rapide google maps"
            width="64"
            height="64"
            className="w-16 object-contain "
          />
        </Link>
      )}
      <div className="flex flex-col justify-start gap-0.5">
        <Typography as="h3" variant="base" className="text-base font-normal">
          {place}
        </Typography>
        <Typography as="span" variant="base" className="font-light">
          {city}, {postalCode}
        </Typography>
      </div>
    </div>
  );
}

export const FirstFormSchema = z
  .object({
    templeRun: z.boolean().optional(),
    templeGym: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    // notentitled is a valid option on it's own no need to check other conditions
    if (val.templeRun ?? val.templeGym) return true;

    if (!val.templeRun) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["templeRun"],
        message: "Veuillez selectionner au moins un cours.",
      });
      return true;
    } else if (!val.templeGym) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["templeGym"],
        message: "Veuillez selectionner au moins un cours.",
      });
      return true;
    }
  });

function FirstStepForm() {
  const { nextStep } = useStepper();
  const { setFirstFormPart } = useRegisterFormStore((state) => state);

  const form = useForm<z.infer<typeof FirstFormSchema>>({
    resolver: zodResolver(FirstFormSchema),
    resetOptions: {
      keepDirtyValues: true,
    },
    shouldFocusError: true,
  });

  const onSubmit = async (data: z.infer<typeof FirstFormSchema>) => {
    setFirstFormPart(data);
    nextStep();
  };

  return (
    <Form {...form}>
      <form
        id="registerForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormCard
          title="Adhésion"
          description="Choisissez le cours où vous souhaitez vous inscrire."
          button={<StepperFormActions />}
          classNames={{ Card: "max-w-[750px]" }}
        >
          <FormField
            control={form.control}
            name="templeRun"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex cursor-pointer items-center gap-4 rounded-lg border p-6">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="grid w-full grid-cols-[3fr_1fr] grid-rows-[1.75rem_auto] gap-2">
                    <Typography
                      as="h1"
                      variant="lead"
                      className="col-span-2 col-start-1 row-start-1 text-black"
                    >
                      Temple Run
                    </Typography>
                    <div className="flex flex-col gap-2 font-normal">
                      <Typography
                        variant="base"
                        className="col-start-1 row-start-2 self-start font-light"
                      >
                        Samedi - 17h30/18h30
                      </Typography>
                      <Typography
                        as="p"
                        variant="base"
                        className="col-start-1 row-start-2"
                      >
                        Votre enfant souhaite découvrir le Parkour (art du
                        déplacement) ? Encadré, on seras l&apos;accompagné dans
                        la découverte de ce sport qui est le notre !
                      </Typography>
                    </div>
                    <Localisation
                      place="Salle des Prairies"
                      city="Voiron"
                      postalCode="38500"
                      locationQuery={{ apple: "", google: "" }}
                    />
                  </div>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="templeGym"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex cursor-pointer items-center gap-4 rounded-lg border p-6">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="grid w-full grid-cols-[3fr_1fr] grid-rows-[1.75rem_auto] gap-2">
                    <Typography
                      as="h1"
                      variant="lead"
                      className="col-span-2 col-start-1 row-start-1 text-black"
                    >
                      Temple Gym
                    </Typography>
                    <div className="flex flex-col gap-2 font-normal">
                      <Typography
                        variant="base"
                        className="col-start-1 row-start-2 self-start font-light"
                      >
                        Samedi - 19h/20h30
                      </Typography>
                      <Typography
                        as="p"
                        variant="base"
                        className="col-start-1 row-start-2"
                      >
                        Une salle spécialisé gymnastique, de quoi vous entrainé
                        et essayer tous ce qui vous passe par la tête sans vous
                        blesser !
                      </Typography>
                    </div>
                    <Localisation
                      place="Gymnase Pierre de Coubertin"
                      city="Voiron"
                      postalCode="38500"
                      locationQuery={{ apple: "", google: "" }}
                    />
                  </div>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormCard>
      </form>
    </Form>
  );
}

/*

*/
const SecondFormSchema = z.object({
  firstname: z.string({ required_error: "Veuillez saisir votre prénom." }),
  lastname: z.string({ required_error: "Veuillez saisir votre nom." }),
  birthdate: z.string({
    required_error: "Veuillez saisir votre date de naissance.",
  }),
  gender: z.string({ required_error: "Veuillez saisir le genre." }),
  mail: z
    .string({ required_error: "Veuillez saisir votre email." })
    .email("Adresse email invalide."),
  phoneNumber: z
    .string({ required_error: "Veuillez saisir votre numéro de téléphone." })
    .refine(isValidPhoneNumber, { message: "Numéro de téléphone invalide." })
    .optional(),
  address: z.string({ required_error: "Veuillez saisir l'adresse." }),
  city: z.string({ required_error: "Veuillez saisir la ville." }),
  postalCode: z.string({
    required_error: "Veuillez saisir le code postal.",
  }),
  country: z.string({ required_error: "Veuillez saisir le pays." }),
});

function SecondStepForm() {
  const { nextStep } = useStepper();
  const [isAdult, setIsAdult] = useState(true);
  const { setSecondFormPart, setAdult } = useRegisterFormStore(
    (state) => state,
  );

  const dynamicSchema: z.ZodSchema<z.infer<typeof SecondFormSchema>> =
    SecondFormSchema.extend({
      phoneNumber: isAdult
        ? z
            .string({
              required_error: "Veuillez saisir votre numéro de téléphone.",
            })
            .refine(isValidPhoneNumber, {
              message: "Numéro de téléphone invalide.",
            })
        : z
            .string()
            .refine(isValidPhoneNumber, {
              message: "Numéro de téléphone invalide.",
            })
            .optional(),
    });

  const form = useForm<z.infer<typeof SecondFormSchema>>({
    resolver: zodResolver(dynamicSchema),
    resetOptions: {
      keepDirtyValues: true,
    },
    shouldFocusError: true,
  });

  const onSubmit = async (data: z.infer<typeof SecondFormSchema>) => {
    setSecondFormPart(data);
    setAdult(isAdult);
    nextStep();
  };

  return (
    <Form {...form}>
      <form
        id="registerForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormCard
          title="Adhérent"
          description="Entrez les informations de l'adhérent"
          button={<StepperFormActions />}
        >
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Pierre"
                    className={inputClass}
                    aria-required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem className="col-start-2 row-start-1">
                <FormLabel>Nom *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Dupont"
                    className={inputClass}
                    aria-required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de naissance *</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className={inputClass}
                    required
                    aria-required
                    {...field}
                    onChange={(event) => {
                      if (event.target.value) {
                        const timeDiff = Math.abs(
                          Date.now() -
                            (event.target.valueAsDate?.getTime() ??
                              Date.parse("01-01-1970")),
                        );
                        const age = Math.floor(
                          timeDiff / (1000 * 3600 * 24) / 365,
                        );
                        age >= 18 ? setIsAdult(true) : setIsAdult(false);
                      }
                      field.onChange(event);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre *</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    aria-required
                  >
                    <SelectTrigger
                      className={cn(
                        "w-[180px] py-5 text-base focus-visible:ring-blue-500",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">
                        {isAdult ? "Homme" : "Garçon"}
                      </SelectItem>
                      <SelectItem value="woman">
                        {isAdult ? "Femme" : "Fille"}
                      </SelectItem>
                      <SelectItem value="other">Autres</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mail"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Adressse email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="exemple@domaine.fr"
                    className={inputClass}
                    aria-required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone {isAdult ? "*" : ""}</FormLabel>
                <FormControl>
                  <PhoneInput
                    defaultCountry="FR"
                    placeholder="0600000000"
                    {...field}
                    required={isAdult}
                    aria-required={isAdult}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Adresse *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder=""
                    className={inputClass}
                    aria-required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder=""
                    className={inputClass}
                    aria-required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code postal *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder=""
                    className={inputClass}
                    aria-required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder=""
                    className={inputClass}
                    aria-required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormCard>
      </form>
    </Form>
  );
}

const ThirdFormSchema = z.object({
  pictureFile: z.string(),
  emergencyContactName1: z
    .string({ required_error: "Veuillez saisir le nom du responsable légale." })
    .optional(),
  emergencyContactPhone1: z
    .string()
    .refine(isValidPhoneNumber, { message: "Numéro de téléphone invalide." })
    .or(z.literal(""))
    .optional(),
  emergencyContactName2: z
    .string({ required_error: "Veuillez saisir le nom du responsable légale." })
    .optional(),
  emergencyContactPhone2: z
    .string()
    .refine(isValidPhoneNumber, { message: "Numéro de téléphone invalide." })
    .or(z.literal(""))
    .optional(),
  imageRights: z.boolean(),
  internalRules: z.boolean(),
});

function ThirdStepForm() {
  const { nextStep } = useStepper();
  const [emergencyContact2PartialFilled, setEmergencyContact2PartialFilled] =
    useState(false);
  const { setThirdFormPart, isAdult, firstFormPart, secondFormPart } =
    useRegisterFormStore((state) => state);

  console.log(firstFormPart, secondFormPart, isAdult);

  const dynamicSchema: z.ZodSchema<z.infer<typeof ThirdFormSchema>> =
    ThirdFormSchema.extend({
      emergencyContactName1: isAdult
        ? z
            .string({
              required_error: "Veuillez saisir le nom du responsable légale.",
            })
            .optional()
        : z.string({
            required_error: "Veuillez saisir le nom du responsable légale.",
          }),
      emergencyContactPhone1: isAdult
        ? z
            .string()
            .refine(isValidPhoneNumber, {
              message: "Numéro de téléphone invalide.",
            })
            .or(z.literal(""))
            .optional()
        : z
            .string()
            .refine(isValidPhoneNumber, {
              message: "Numéro de téléphone invalide.",
            })
            .or(z.literal("")),
      emergencyContactName2:
        !isAdult && emergencyContact2PartialFilled
          ? z.string({
              required_error: "Veuillez saisir le nom du responsable légale.",
            })
          : z
              .string({
                required_error: "Veuillez saisir le nom du responsable légale.",
              })
              .optional(),
      emergencyContactPhone2:
        !isAdult && emergencyContact2PartialFilled
          ? z
              .string()
              .refine(isValidPhoneNumber, {
                message: "Numéro de téléphone invalide.",
              })
              .or(z.literal(""))
          : z
              .string()
              .refine(isValidPhoneNumber, {
                message: "Numéro de téléphone invalide.",
              })
              .or(z.literal(""))
              .optional(),
    });

  const form = useForm<z.infer<typeof ThirdFormSchema>>({
    resolver: zodResolver(dynamicSchema),
    resetOptions: {
      keepDirtyValues: true,
    },
    shouldFocusError: true,
  });

  const onSubmit = async (data: z.infer<typeof ThirdFormSchema>) => {
    setThirdFormPart(data);
    nextStep();
  };

  return (
    <Form {...form}>
      <form
        id="registerForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormCard title="" description="" button={<StepperFormActions />}>
          <FormField
            control={form.control}
            name="pictureFile"
            render={({ field }) => (
              <FormItem className="col-span-2 row-start-1">
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <Input type="file" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isAdult && (
            <>
              <div className="col-span-2 grid w-full gap-2">
                <Typography as="h2" variant="h3" className="col-span-2">
                  Contact d&apos;urgence n°1
                </Typography>
                <FormField
                  control={form.control}
                  name="emergencyContactName1"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Nom prénom</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className={inputClass}
                          required={isAdult ?? false}
                          aria-required={isAdult ?? false}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContactPhone1"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="FR"
                          {...field}
                          required={isAdult ?? false}
                          aria-required={isAdult ?? false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2 grid w-full gap-2">
                <Typography as="h2" variant="h3" className="col-span-2">
                  Contact d&apos;urgence n°2
                </Typography>
                <FormField
                  control={form.control}
                  name="emergencyContactName2"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Nom prénom</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className={inputClass}
                          required={isAdult ?? false}
                          aria-required={isAdult ?? false}
                          {...field}
                          onInput={(event) => {
                            event.currentTarget.value?.length
                              ? setEmergencyContact2PartialFilled(true)
                              : setEmergencyContact2PartialFilled(false);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContactPhone2"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="FR"
                          {...field}
                          required={isAdult ?? false}
                          aria-required={isAdult ?? false}
                          onInput={(event) => {
                            event.currentTarget.value?.length
                              ? setEmergencyContact2PartialFilled(true)
                              : setEmergencyContact2PartialFilled(false);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          <FormField
            control={form.control}
            name="imageRights"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      required
                      aria-required
                    />
                  </FormControl>
                  <Typography as="span" variant="base" className="font-normal">
                    {isAdult
                      ? "Autorisation pour le droit à l'image."
                      : "Autorisation parentale pour le droit à l’image."}
                  </Typography>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="internalRules"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      required
                      aria-required
                    />
                  </FormControl>
                  <Typography as="span" variant="base" className="font-normal">
                    J'ai lu et j'accepte le règlement intérieur.
                  </Typography>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormCard>
      </form>
    </Form>
  );
}

const FourthFormSchema = z.object({
  medicalComments: z
    .string()
    .max(200, { message: "Le texte est trop long." })
    .optional(),
  medicalFile: z.string({
    required_error: "Veuillez transmettre le certificat médicale.",
  }),
});

function FourthStepForm() {
  const { nextStep } = useStepper();
  const [medicalCommentsLength, setMedicalCommentsLength] = useState(0);
  const { setFourthFormPart, isAdult } = useRegisterFormStore((state) => state);

  const form = useForm<z.infer<typeof FourthFormSchema>>({
    resolver: zodResolver(FourthFormSchema),
    resetOptions: {
      keepDirtyValues: true,
    },
    shouldFocusError: true,
  });

  const onSubmit = async (data: z.infer<typeof FourthFormSchema>) => {
    setFourthFormPart(data);
    nextStep();
  };

  return (
    <Form {...form}>
      <form
        id="registerForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormCard title="" description="" button={<StepperFormActions />}>
          <FormField
            control={form.control}
            name="medicalComments"
            render={({ field }) => (
              <FormItem className="col-span-2 row-start-1">
                <FormLabel>Remarques ou problèmes médicaux</FormLabel>
                <FormControl>
                  <Textarea
                    className={cn(
                      inputClass,
                      "h-24 w-full resize-none object-bottom p-2 text-base md:min-w-[500px]",
                    )}
                    onInput={(event) => {
                      setMedicalCommentsLength(event.currentTarget.textLength);
                    }}
                    {...field}
                  />
                </FormControl>
                <div className="relative">
                  <FormDescription className="absolute right-0">
                    {medicalCommentsLength}/200
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="medicalFile"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Certificat médical</FormLabel>
                <FormControl>
                  <Input id="medicalFile" type="file" />
                </FormControl>
              </FormItem>
            )}
          />
        </FormCard>
      </form>
    </Form>
  );
}

function StepperFormActions() {
  const {
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    activeStep,
  } = useStepper();

  return (
    <div className="flex h-full w-full">
      {hasCompletedAllSteps ? (
        <Button size="sm" type="button" onClick={resetSteps}>
          Reset
        </Button>
      ) : (
        <>
          {activeStep !== 0 && (
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              variant="secondary"
              type="button"
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
            {isLastStep
              ? "S'inscrire"
              : activeStep === 0
                ? "Commencer"
                : "Continuer"}
          </Button>
        </>
      )}
    </div>
  );
}

export { FirstStepForm, FourthStepForm, SecondStepForm, ThirdStepForm };
