"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/dropzone";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, PhoneInput } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStepper } from "@/components/ui/stepper";
import { Typography } from "@/components/ui/typography";
import { calculateAge, cn, getCountriesNames } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckIcon,
  ChevronsUpDown,
  CloudUpload,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { DropzoneOptions } from "react-dropzone";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import StepperFormActions from "../StepperFormActions";
import { FormCard } from "../formCard";
import { useRegisterFormStore } from "@/stores/registerFormStore";
import useStore from "@/stores/useStore";
import { Gender, Prisma } from "@prisma/client";

const inputClass = cn("bg-background object-bottom");

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

/* --------------------------------------------------------
 *                            Form
   -------------------------------------------------------- */

export default function Member() {
  const { nextStep, setStep } = useStepper();
  const [isAdult, setIsAdult] = useState(false);
  const { setMember, member, setAdult } = useStore(
    useRegisterFormStore.getState,
    (state) => state,
  );

  const form = useForm<z.infer<typeof MemberSchema>>({
    resolver: zodResolver(MemberSchema),
    resetOptions: {
      keepDirtyValues: true,
    },
    defaultValues: {
      ...member,
      country: member?.country ?? "France",
    },
    shouldFocusError: true,
  });

  const dropZoneConfig = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".tiff"],
    },
    maxFiles: 1,
    maxSize: MAX_UPLOAD_SIZE,
    multiple: false,
  } satisfies DropzoneOptions;

  const onSubmit = async (data: z.infer<typeof MemberSchema>) => {
    if (data.photo?.[0]) {
      const image: File = data.photo[0];
      // uploadFile.mutate(
      //   { image },
      //   {
      //     onSuccess: (value) => {
      //       pictureFilename = value;
      //     },
      //   },
      // );
      setMember({ ...data });
      setAdult(isAdult);
      if (isAdult) {
        setStep(3);
        toast(
          <Typography as="span">
            Il n&apos;est pas nécessaire d&apos;avoir des contacts
            d&apos;urgence, si l&apos;adhérent est adulte.
          </Typography>,
          {
            icon: <TriangleAlert className="h-8 w-8 text-orange-500" />,
            duration: 8000,
          },
        );
      } else {
        nextStep();
      }
    }
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
                <FormLabel>Prénom</FormLabel>
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
                <FormLabel>Nom</FormLabel>
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
                <FormLabel>Date de naissance</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className={inputClass}
                    aria-required
                    {...field}
                    value={field.value.toISOString().split("T")[0]}
                    onChange={(event) => {
                      if (event.target.value) {
                        // Convert string to date
                        const inputDate = new Date(event.target.value);
                        // Check if adult
                        calculateAge(inputDate) >= 18
                          ? setIsAdult(true)
                          : setIsAdult(false);

                        // emit date converted to string
                        field.onChange(inputDate);
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
                <FormLabel>Sexe</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    aria-required
                  >
                    <SelectTrigger
                      className={cn(
                        "w-[180px] py-2 text-sm focus-visible:ring-blue-500 aria-invalid:border-destructive",
                        !field.value && "text-muted-foreground",
                      )}
                      aria-invalid={
                        form.getFieldState("gender").invalid ? "true" : "false"
                      }
                    >
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Gender.Male}>Masculin</SelectItem>
                      <SelectItem value={Gender.Female}>Féminin</SelectItem>
                      <SelectItem value={Gender.NotSpecified}>Autre</SelectItem>
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
                <FormLabel className="flex justify-between">
                  <span>
                    E-mail de l&apos;adhérent <strong>UNIQUEMENT</strong>
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="exemple@domaine.fr"
                    className={inputClass}
                    aria-required
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between">
                  <span>Téléphone de l&apos;adhérent</span>
                  {!isAdult && (
                    <span className="translate-y-2 text-xs font-normal text-muted-foreground">
                      optionnel
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <PhoneInput
                    defaultCountry="FR"
                    placeholder="06 12 34 56 78"
                    {...field}
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
                <FormLabel>Adresse</FormLabel>
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
                <FormLabel>Ville</FormLabel>
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
                <FormLabel>Code postal</FormLabel>
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
                <FormLabel>Pays</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant={"outline"}
                        className={cn(
                          " flex w-full justify-between gap-1 rounded-s-lg px-3 hover:scale-100",
                        )}
                        disabled={field.disabled}
                      >
                        <span className="text-sm font-normal">
                          {field.value}
                        </span>
                        <ChevronsUpDown
                          className={cn(
                            "-mr-2 h-4 w-4 opacity-50",
                            field.disabled ? "hidden" : "opacity-100",
                          )}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandInput placeholder="Rechercher un pays..." />
                          <CommandEmpty>Aucuns pays trouvés.</CommandEmpty>
                          <ScrollArea className="h-[248px]">
                            <CommandGroup className="h-full">
                              {getCountriesNames()
                                .filter((x) => x)
                                .map((option) => (
                                  <CommandItem
                                    className="cursor-pointer gap-2"
                                    key={option as string}
                                    onSelect={field.onChange}
                                    disabled={false}
                                    aria-disabled={false}
                                  >
                                    <span className="flex-1 text-sm">
                                      {option}
                                    </span>
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        option === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </ScrollArea>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Photo (selfies acceptés)</FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    aria-required
                    onValueChange={field.onChange}
                    dropzoneOptions={dropZoneConfig}
                    reSelect
                    className="relative col-span-2 rounded-lg bg-background p-0.5"
                  >
                    <FileInput
                      className={cn(
                        "group h-24 w-full outline-dashed outline-1 outline-foreground data-disabled:opacity-50",
                        form.control.getFieldState("photo").error &&
                          "outline-destructive",
                      )}
                    >
                      <div className="flex h-full w-full flex-col items-center justify-center">
                        <CloudUpload className="transition-colors group-hover:text-primary group-data-disabled:text-foreground" />
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">
                            Ajouter un fichier
                          </span>
                          &nbsp; ou glisser déposer
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          JPG, PNG ou TIFF
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
                            <div className="flex gap-2">
                              <div className="size-16">
                                <AspectRatio className="size-full">
                                  <Image
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="rounded-md object-cover"
                                    fill
                                  />
                                </AspectRatio>
                              </div>
                              <div className="flex flex-col justify-around">
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
                            </div>
                          </FileUploaderItem>
                        ))}
                    </FileUploaderContent>
                  </FileUploader>
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
