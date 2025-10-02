"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PhoneInput } from "@/components/ui/phone-input";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { LegalGuardiansSchema } from "../formUtils";
import type { z } from "zod";
import { CirclePlus, Trash2 } from "lucide-react";

const inputClass = cn("bg-background object-bottom");

/* --------------------------------------------------------
 *                          Form
   -------------------------------------------------------- */

export default function LegalGuardians() {
  const form = useFormContext<z.infer<typeof LegalGuardiansSchema>>();
  const { fields, append, remove } = useFieldArray({
    name: "legalGuardians",
  });

  const rootError = form.formState.errors.legalGuardians?.root;

  return (
    <>
      <CardHeader className="flex-none pb-2 pt-4">
        <Typography as={CardTitle} variant="h1" className="lg:text-4xl">
          Responsables Légaux
        </Typography>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-6">
        {fields.map((field, index) => (
          <div key={field.id} className="col-span-2 grid w-full gap-3">
            <div className="col-span-2 flex justify-between">
              <Typography as="h2" variant="h3" className="col-span-2">
                Contact d&apos;urgence n°{index + 1}
              </Typography>
              {index !== 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                  className="flex w-fit gap-2 px-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <FormField
              control={form.control}
              name={`legalGuardians.${index}.firstname`}
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
              name={`legalGuardians.${index}.lastname`}
              render={({ field }) => (
                <FormItem className="col-start-2">
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
              name={`legalGuardians.${index}.phone`}
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <PhoneInput defaultCountry="FR" {...field} aria-required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`legalGuardians.${index}.mail`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="flex justify-between">
                    E-mail
                    <span className="translate-y-2 text-xs font-normal text-muted-foreground">
                      {index !== 0 && "optionnel"}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="exemple@domaine.fr"
                      className={inputClass}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        {fields.length < 2 && (
          <div className="ml-auto flex gap-2">
            <Button
              variant="default"
              onClick={() =>
                append({
                  firstname: undefined,
                  lastname: undefined,
                  phone: undefined,
                  mail: undefined,
                })
              }
              className="flex w-fit gap-2"
            >
              <CirclePlus /> <span>Ajouter</span>
            </Button>
          </div>
        )}
        <Typography variant="alert" className={cn(!rootError && "hidden")}>
          {rootError?.message}
        </Typography>
      </CardContent>
    </>
  );
}
