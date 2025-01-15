"use client";

import { Button } from "@/components/ui/button";
import { useStepper } from "@/components/ui/stepper";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { FormCard } from "./formCard";

/* --------------------------------------------------------
                    Dropzones constantes
   -------------------------------------------------------- */

// const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB

// Third form dropzone
// const ACCEPTED_FILE_TYPES_THIRD_FORM = [
//   "image/jpeg", // JPEG
//   "image/png", // PNG
//   "image/tiff", // TIFF
// ];

// Fourth form dropzone
// const ACCEPTED_FILE_TYPES_FOUTH_FORM = [
//   "application/pdf", // PDF
//   "image/jpeg", // JPEG
//   "image/png", // PNG
//   "image/tiff", // TIFF
// ];

/* --------------------------------------------------------
 *                     Third Form
   -------------------------------------------------------- */
export const ThirdFormSchema = z.object({
  emergencyContactName1: z
    .string({ required_error: "Ce champ est obligatoire." })
    .optional(),
  emergencyContactPhone1: z
    .string()
    .refine(isValidPhoneNumber, { message: "Numéro de téléphone invalide." })
    .or(z.literal(""))
    .optional(),
  emergencyContactName2: z
    .string({ required_error: "Ce champ est obligatoire." })
    .optional(),
  emergencyContactPhone2: z
    .string()
    .refine(isValidPhoneNumber, { message: "Numéro de téléphone invalide." })
    .or(z.literal(""))
    .optional(),
  imageRights: z
    .boolean()
    .refine((value) => value, "Ce champs est obligatoire."),
  internalRules: z
    .boolean()
    .refine((value) => value, "Ce champs est obligatoire."),
});

/* export default function ThirdStepForm() {
  const { nextStep } = useStepper();
  const [emergencyContact2PartialFilled, setEmergencyContact2PartialFilled] =
    useState(false);
  const { setThirdFormPart, thirdFormPart, isAdult } = useRegisterFormStore(
    (state) => state,
  );

  const dynamicSchema: z.ZodSchema<z.infer<typeof ThirdFormSchema>> =
    ThirdFormSchema.extend({
      emergencyContactName1: isAdult
        ? z
            .string({
              required_error: "Ce champ est obligatoire.",
            })
            .optional()
        : z.string({
            required_error: "Ce champ est obligatoire.",
          }),
      emergencyContactPhone1: isAdult
        ? z
            .string({
              required_error: "Ce champ est obligatoire.",
            })
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
              required_error: "Ce champ est obligatoire.",
            })
          : z
              .string({
                required_error: "Ce champ est obligatoire.",
              })
              .optional(),
      emergencyContactPhone2:
        !isAdult && emergencyContact2PartialFilled
          ? z
              .string({
                required_error: "Ce champ est obligatoire.",
              })
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
    defaultValues: {
      emergencyContactName1: thirdFormPart?.emergencyContactName1 ?? "",
      emergencyContactPhone1: thirdFormPart?.emergencyContactPhone1 ?? "",
      emergencyContactName2: thirdFormPart?.emergencyContactName2 ?? "",
      emergencyContactPhone2: thirdFormPart?.emergencyContactPhone2 ?? "",
      imageRights: thirdFormPart?.imageRights ?? false,
      internalRules: thirdFormPart?.internalRules ?? false,
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
        <FormCard
          title="Autres informations"
          description="Photo, contact d'urgence, etc..."
          button={<StepperFormActions />}
        >
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
                      aria-required
                    />
                  </FormControl>
                  <Typography as="span" variant="base" className="font-normal">
                    J&apos;ai lu et j&apos;accepte le règlement intérieur.
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
} */

/* --------------------------------------------------------
 *                 Form Resume
   -------------------------------------------------------- */

export function Resume() {
  return (
    <FormCard
      title="Résumé"
      description=" "
      button={<StepperFormActions />}
    ></FormCard>
  );
}

/* --------------------------------------------------------
 *                 Stepper Form Action
   -------------------------------------------------------- */

export default function StepperFormActions() {
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
