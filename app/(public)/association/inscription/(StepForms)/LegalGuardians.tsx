"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { PhoneInput } from "@/components/ui/phone-input";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { type LegalGuardiansSchema } from "../page";
import { z } from "zod";
import { CirclePlus, CircleMinus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const inputClass = cn("bg-background object-bottom");

const defaultCountry = "FR";

/* --------------------------------------------------------
 *                          Form
   -------------------------------------------------------- */

export default function LegalGuardians() {
  const form = useFormContext<z.infer<typeof LegalGuardiansSchema>>();
  const [nbLegalGuardians, setNbLegalGuardians] = useState(1);
  const [LegalGuardians2PartialFilled, setLegalGuardians2PartialFilled] =
    useState(false);

  return (
    <>
      <CardHeader className="flex-none pb-2 pt-4">
        <Typography as={CardTitle} variant="h1" className="lg:text-4xl">
          Responsables Légaux
        </Typography>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-6">
        {Array.from(
          { length: nbLegalGuardians },
          (value, index) => index + 1,
        ).map((value) => (
          <div key={uuidv4()} className="col-span-2 grid w-full gap-3">
            <Typography as="h2" variant="h3" className="col-span-2">
              Contact d&apos;urgence n°{value}
            </Typography>
            <FormField
              control={form.control}
              name={`${value}.firstname`}
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
              name={`${value}.lastname`}
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
              name={`${value}.phone`}
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
              name={`${value}.mail`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="flex justify-between">E-mail<span className="translate-y-2 text-xs font-normal text-muted-foreground">
                  optionnel
                </span></FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="exemple@domaine.fr"
                      className={inputClass}
                      {...field}
                      value={field.value ?? ""}
                      aria-required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        <div className="flex gap-2 ml-auto">
          {nbLegalGuardians > 1 && (
            <Button
              variant="outline"
              onClick={() => {
                const newValue = nbLegalGuardians - 1;
                setNbLegalGuardians(newValue);
                form.
              }}
              className="flex w-fit gap-2"
            >
              <CircleMinus /> <span>Supprimer</span>
            </Button>
          )}
          <Button
            variant="default"
            onClick={() => {
              const newValue = nbLegalGuardians + 1;
              setNbLegalGuardians(newValue);
            }}
            className="flex w-fit gap-2"
          >
            <CirclePlus /> <span>Ajouter</span>
          </Button>
        </div>
      </CardContent>
    </>
  );
}
