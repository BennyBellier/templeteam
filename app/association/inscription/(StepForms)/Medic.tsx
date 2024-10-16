"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useStepper } from "@/components/ui/stepper";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useRegisterFormStore } from "@/providers/RegisterFormProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormCard } from "../formCard";
import StepperFormActions from "../StepperFormActions";

const inputClass = cn("bg-background object-bottom");

/* --------------------------------------------------------
 *                          Schema
   -------------------------------------------------------- */

export const MedicSchema = z.object({
  medicalComments: z
    .string()
    .max(200, { message: "Le texte est trop long." })
    .optional(),
  /* medicalFile: z
    .array(z.instanceof(File))
    /* .refine(
      (files) => files.length > 0,
      "Le certificat médical est obligatoire.",
     )
    .refine((files) => {
      return files?.every((file) => file.size <= MAX_UPLOAD_SIZE);
    }, "La taille du fichier doit faire moins de 3MB.")
    .refine((files) => {
      return files?.every((file) =>
        ACCEPTED_FILE_TYPES_FOUTH_FORM.includes(file.type),
      );
    }, "Le fichier doit être de type PDF, PNG, JPEG ou TIFF."), */
  medicalCertificate: z
    .boolean({
      required_error: "Ce champs est obligatoire.",
    })
    .refine((value) => value, "Ce champs est obligatoire."),
});

/* --------------------------------------------------------
 *                          Form
   -------------------------------------------------------- */

export default function MedicForm() {
  const { nextStep } = useStepper();
  const [medicalCommentsLength, setMedicalCommentsLength] = useState(0);
  const { setMedic, medic } = useRegisterFormStore(
    (state) => state,
  );

  const form = useForm<z.infer<typeof MedicSchema>>({
    resolver: zodResolver(MedicSchema),
    resetOptions: {
      keepDirtyValues: true,
    },
    shouldFocusError: true,
    defaultValues: {
      medicalComments: medic?.medicalComments ?? "",
      medicalCertificate: medic?.medicalCertificate ?? false,
    },
  });

  const onSubmit = async (data: z.infer<typeof MedicSchema>) => {
    setMedic(data);
    nextStep();
  };

  /* const dropZoneConfig = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".pdf"],
    },
    maxFiles: 1,
    maxSize: MAX_UPLOAD_SIZE,
    multiple: false,
  } satisfies DropzoneOptions; */

  return (
    <Form {...form}>
      <form
        id="registerForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormCard
          title="Informations médicales"
          description=" "
          button={<StepperFormActions />}
        >
          <FormField
            control={form.control}
            name="medicalComments"
            render={({ field }) => (
              <FormItem className="col-span-2 row-start-1">
                <FormLabel className="flex justify-between">
                  <span>Remarques ou problèmes médicaux</span>{" "}
                  <span className="translate-y-2 text-xs font-normal text-muted-foreground">
                    optionnel
                  </span>
                </FormLabel>
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
                  <FormDescription
                    className={cn(
                      "absolute right-0",
                      medicalCommentsLength > 200 ? "text-destructive" : "",
                    )}
                  >
                    {medicalCommentsLength}/200
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="medicalCertificate"
            render={({ field }) => (
              <FormItem className="col-span-2 pt-2">
                <span
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    form.control.getFieldState("medicalCertificate").error &&
                      "text-destructive",
                  )}
                >
                  Certificat médical
                </span>
                <Typography
                  as="p"
                  variant="quote"
                  className="w-full text-pretty rounded-lg border-none bg-primary/20 p-2 text-sm md:max-w-[500px]"
                >
                  Un certificat médical sera requis lors de votre inscription
                  définitive. Le modèle à compléter par votre médecin vous sera
                  automatiquement envoyé à la fin de cette pré-inscription.
                </Typography>
                <div className="flex justify-between">
                  <FormLabel className="flex justify-between pt-2 font-normal">
                    J&apos;accepte devoir fournir un certificat médical
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={field.disabled}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FormControl>
                </div>
                {/* <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    dropzoneOptions={dropZoneConfig}
                    reSelect
                    className="relative col-span-2 rounded-lg bg-background p-0.5"
                  >
                    <FileInput className="group h-24 w-full outline-dashed outline-1 outline-foreground data-disabled:opacity-50">
                      <div className="flex h-full w-full flex-col items-center justify-center">
                        <CloudUpload className="transition-colors group-hover:text-primary group-data-disabled:text-foreground" />
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">
                            Ajouter un fichier
                          </span>
                          &nbsp; ou glisser déposer
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          JPG, PNG ou PDF
                        </p>
                      </div>
                    </FileInput>
                    <FileUploaderContent>
                      {field.value &&
                        field.value.length > 0 &&
                        field.value.map((file, i) => (
                          <FileUploaderItem
                            key={i}
                            index={i}
                            className="flex h-fit justify-center bg-card"
                          >
                            <div className="grid gap-2">
                              <FileText className="col-start-1 row-span-2 row-start-1 h-8 w-8 self-center justify-self-center" />
                              <Typography as="span" className="col-start-2">
                                {file.name}
                              </Typography>
                              <Typography
                                as="span"
                                variant="quote"
                                className="col-start-2 m-0 border-none p-0"
                              >
                                {Math.round(file.size / 1024)}Kb
                              </Typography>
                            </div>
                          </FileUploaderItem>
                        ))}
                    </FileUploaderContent>
                  </FileUploader> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </FormCard>
      </form>
    </Form>
  );
}
