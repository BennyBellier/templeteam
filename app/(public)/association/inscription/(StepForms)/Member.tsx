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
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/dropzone";
import {
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
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
import { Typography } from "@/components/ui/typography";
import { calculateAge, cn } from "@/lib/utils";
import { ChevronsUpDown, CloudUpload, Check } from "lucide-react";
import { useState } from "react";
import type { DropzoneOptions } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import { type MemberSchema, MAX_UPLOAD_SIZE } from "../page";
import { Gender } from "@prisma/client";
import { countries } from "@/components/ui/phone-input/countries";
import Image from "next/image";
import * as React from "react";
import { useRegisterFormStore } from "@/stores/registerFormStore";

const inputClass = cn("bg-background object-bottom");

/* --------------------------------------------------------
 *                            Form
   -------------------------------------------------------- */

const defaultCountry = "FR";

export default function Member() {
  const form = useFormContext<z.infer<typeof MemberSchema>>();
  const [countrySelectorOpen, setCountrySelectorOpen] = useState(false);
  const [medicalCommentsLength, setMedicalCommentsLength] = useState(0);
  const { member } = useRegisterFormStore((state) => state);

  const dropZoneConfig = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".tiff"],
    },
    maxFiles: 1,
    maxSize: MAX_UPLOAD_SIZE,
    multiple: false,
  } satisfies DropzoneOptions;

  const birthdate = form.watch("birthdate");
  const isAdult = calculateAge(new Date(birthdate)) >= 18;

  return (
    <>
      <CardHeader className="flex-none pb-2 pt-4">
        <Typography as={CardTitle} variant="h1" className="lg:text-4xl">
          Adhérent
        </Typography>
        <Typography as={CardDescription} variant="lead">
          Entrez les informations de l&apos;adhérent.
        </Typography>
      </CardHeader>
      <CardContent className="grid h-full gap-6">
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
                  className={cn(inputClass, "capitalize")}
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
                  className={cn(inputClass, "uppercase")}
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
                  {...field}
                  {...form.register("birthdate", { valueAsDate: true })}
                  type="date"
                  className={inputClass}
                  aria-required
                  value={
                    new Date(field.value).toString() !== 'Invalid Date'
                      ? new Date(field.value).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? new Date(e.target.value) : "",
                    )
                  }
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
                <span>E-mail de l&apos;adhérent</span>
                {!isAdult && (
                  <span className="translate-y-2 text-xs font-normal text-muted-foreground">
                    optionnel
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="exemple@domaine.fr"
                  className={inputClass}
                  aria-required={isAdult}
                  {...field}
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
                  {...field}
                  aria-required={isAdult}
                  defaultCountry={defaultCountry}
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
                  className={cn(inputClass, "uppercase")}
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
                  className={cn(inputClass, "uppercase")}
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
                <Popover
                  open={countrySelectorOpen}
                  onOpenChange={setCountrySelectorOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        " flex w-full justify-between gap-1 rounded-s-lg px-3 hover:scale-100",
                      )}
                      disabled={field.disabled}
                    >
                      <span className="text-sm font-normal">{field.value}</span>
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
                            {countries.map((country) => {
                              return (
                                <CommandItem
                                  key={country.iso3}
                                  value={country.name}
                                  onSelect={() => {
                                    field.onChange(country.name);
                                    setCountrySelectorOpen(false);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 size-4",
                                      field.value === country.iso2
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  <Image
                                    src={`/flags/${country.iso2.toLowerCase()}.svg`}
                                    width={16}
                                    height={12}
                                    className="relative top-0.5 mr-2 h-3 w-4 object-cover"
                                    aria-labelledby={country.name}
                                    title={country.name}
                                    alt={country.name}
                                  />
                                  {country.name}
                                </CommandItem>
                              );
                            })}
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
          name="medicalComment"
          render={({ field }) => (
            <FormItem className="col-span-2">
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
                      field.value.map((file: File, i) => (
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
      </CardContent>
    </>
  );
}
