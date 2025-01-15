"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, PhoneInput } from "@/components/ui/input";
import { useStepper } from "@/components/ui/stepper";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useRegisterFormStore } from "@/providers/RegisterFormProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { FormCard } from "../formCard";
import StepperFormActions from "../StepperFormActions";

const inputClass = cn("bg-background object-bottom");

/* --------------------------------------------------------
 *                          Schema
   -------------------------------------------------------- */
export const LegalGuardiansSchema = z.object({
  LegalGuardiansName1: z
    .string({
      required_error: "Ce champ est obligatoire.",
    })
    .min(1, {
      message: "Ce champ est obligatoire.",
    }),
  LegalGuardiansPhone1: z
    .string({ required_error: "Ce champ est obligatoire." })
    .refine(isValidPhoneNumber, { message: "Numéro de téléphone invalide." })
    .or(z.literal("")),
  LegalGuardiansName2: z
    .string({ required_error: "Ce champ est obligatoire." })
    .optional(),
  LegalGuardiansPhone2: z
    .string()
    .refine(isValidPhoneNumber, { message: "Numéro de téléphone invalide." })
    .or(z.literal(""))
    .optional(),
});

/* --------------------------------------------------------
 *                          Form
   -------------------------------------------------------- */

export default function LegalGuardians() {
  const { nextStep } = useStepper();
  const [LegalGuardians2PartialFilled, setLegalGuardians2PartialFilled] =
    useState(false);
  const { setLegalGuardians, LegalGuardians, isAdult } =
    useRegisterFormStore((state) => state);

  const dynamicSchema: z.ZodSchema<z.infer<typeof LegalGuardiansSchema>> =
    LegalGuardiansSchema.extend({
      LegalGuardiansName2: LegalGuardians2PartialFilled
        ? z.string({
            required_error: "Ce champ est obligatoire.",
          })
        : z
            .string({
              required_error: "Ce champ est obligatoire.",
            })
            .optional(),
      LegalGuardiansPhone2: LegalGuardians2PartialFilled
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

  const form = useForm<z.infer<typeof LegalGuardiansSchema>>({
    resolver: zodResolver(dynamicSchema),
    resetOptions: {
      keepDirtyValues: true,
    },
    defaultValues: {
      LegalGuardiansName1:
        LegalGuardians?.LegalGuardiansName1 ?? undefined,
      LegalGuardiansPhone1:
        LegalGuardians?.LegalGuardiansPhone1 ?? undefined,
      LegalGuardiansName2:
        LegalGuardians?.LegalGuardiansName2 ?? undefined,
      LegalGuardiansPhone2:
        LegalGuardians?.LegalGuardiansPhone2 ?? undefined,
    },
    shouldFocusError: true,
  });

  const onSubmit = async (data: z.infer<typeof LegalGuardiansSchema>) => {
    setLegalGuardians(data);
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
          <div className="col-span-2 grid w-full gap-2">
            <Typography as="h2" variant="h3" className="col-span-2">
              Contact d&apos;urgence n°1
            </Typography>
            <FormField
              control={form.control}
              name="LegalGuardiansName1"
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
              name="LegalGuardiansPhone1"
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
              name="LegalGuardiansName2"
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
                          ? setLegalGuardians2PartialFilled(true)
                          : setLegalGuardians2PartialFilled(false);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="LegalGuardiansPhone2"
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
                          ? setLegalGuardians2PartialFilled(true)
                          : setLegalGuardians2PartialFilled(false);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormCard>
      </form>
    </Form>
  );
}
