"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useStepper } from "@/components/ui/stepper";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useRegisterFormStore } from "@/providers/RegisterFormProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Signature as SignatureIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import { z } from "zod";
import { FormCard } from "../formCard";
import registerMember from "../registerMember";
import StepperFormActions from "../StepperFormActions";
import { arrayBuffer } from "stream/consumers";

const labelClassName = cn(
  "grid cursor-pointer gap-2 rounded-lg border border-input px-4 py-3",
);

/* --------------------------------------------------------
 *                          Schema
   -------------------------------------------------------- */
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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/* --------------------------------------------------------
 *                          Form
   -------------------------------------------------------- */

export default function Authorization() {
  const { nextStep } = useStepper();
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    setAuthorization,
    authorization,
    member,
    emergencyContact,
    medic,
    membership,
    isAdult,
    setAdult,
  } = useRegisterFormStore((state) => state);

  const form = useForm<z.infer<typeof AuthorizationSchema>>({
    resolver: zodResolver(AuthorizationSchema),
    resetOptions: {
      keepDirtyValues: true,
    },
    shouldFocusError: true,
    defaultValues: {
      emergencyAuthorization: authorization?.emergencyAuthorization ?? false,
      travelAuthorization: authorization?.travelAuthorization ?? false,
      theftLossLiability: authorization?.theftLossLiability ?? false,
      refund: authorization?.refund ?? false,
      imageRights: authorization?.imageRights ?? false,
      internalRules: authorization?.internalRules ?? false,
      signature: authorization?.signature ?? undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof AuthorizationSchema>) => {
    setAuthorization(data);
    if (
      membership &&
      member &&
      authorization &&
      medic &&
      (isAdult === true || (isAdult === false && emergencyContact))
    ) {
      nextStep();

      if (member.picture && member.picture.length > 0) {
        await fileToBase64(member.picture[0]!)
          .then(async (base64String) => {
            await registerMember({
              membership,
              member: { ...member, picture: base64String },
              emergencyContact,
              authorization,
              medic,
              isAdult,
            });
          })
          .catch((error) => {
            console.error("Erreur lors de la conversion en Base64 :", error);
          });
      } else {
        console.log("Aucun fichier à convertir.");
      }

    }
  };

  const undersigner = () => {
    if (isAdult) {
      return (
        <SelectItem value={member?.lastname + " " + member?.firstname}>
          {member?.lastname + " " + member?.firstname}
        </SelectItem>
      );
    }

    if (emergencyContact?.emergencyContactName2) {
      return (
        <>
          <SelectItem value={emergencyContact?.emergencyContactName1!}>
            {emergencyContact?.emergencyContactName1}
          </SelectItem>
          <SelectItem value={emergencyContact?.emergencyContactName2!}>
            {emergencyContact?.emergencyContactName2}
          </SelectItem>
        </>
      );
    }

    return (
      <SelectItem value={emergencyContact?.emergencyContactName1!}>
        {emergencyContact?.emergencyContactName1}
      </SelectItem>
    );
  };

  return (
    <Form {...form}>
      <form
        id="registerForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormCard
          title="Autorisations"
          description="Concernant le licencié"
          button={<StepperFormActions />}
        >
          {/* Undersigned */}
          <FormField
            control={form.control}
            name="undersigned"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Je soussigné</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={undefined}
                    aria-required
                  >
                    <SelectTrigger
                      className={cn(
                        "py-2 text-sm focus-visible:ring-blue-500 aria-invalid:border-destructive",
                        !field.value && "text-muted-foreground",
                      )}
                      aria-invalid={
                        form.getFieldState("undersigned").invalid
                          ? "true"
                          : "false"
                      }
                    >
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>{undersigner()}</SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Emergency authorization */}
          <FormField
            control={form.control}
            name="emergencyAuthorization"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClassName}>
                  <FormControl>
                    <Checkbox
                      className="col-start-1 row-start-2"
                      aria-required
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Typography as="span" className="col-start-2 row-start-1">
                    Décision en cas d&apos;urgence d&apos;urgence
                  </Typography>
                  <Typography
                    as={FormDescription}
                    className="col-start-2 row-start-2 max-w-[500px]"
                  >
                    autorise les responsables de l&apos;association à prendre,
                    en son nom, toutes les décisions nécessaires en cas
                    d&apos;urgence, notamment pour des raisons médicales ou
                    autres situations critiques, afin d&apos;assurer sa sécurité
                    et son bien-être.
                  </Typography>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Travel authorization */}
          <FormField
            control={form.control}
            name="travelAuthorization"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClassName}>
                  <FormControl>
                    <Checkbox
                      className="col-start-1 row-start-2"
                      aria-required
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Typography as="span" className="col-start-2 row-start-1">
                    Utilisation des véhicules{" "}
                  </Typography>
                  <Typography
                    as={FormDescription}
                    className="col-start-2 row-start-2 max-w-[500px]"
                  >
                    autorise l&apos;association à organiser ses déplacements
                    dans des véhicules privés mis à disposition par
                    l&apos;association ou appartenant aux responsables, si cela
                    s&apos;avère nécessaire pour les activités.
                  </Typography>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image rights */}
          <FormField
            control={form.control}
            name="imageRights"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClassName}>
                  <FormControl>
                    <Checkbox
                      className="col-start-1 row-start-2"
                      aria-required
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Typography as="span" className="col-start-2 row-start-1">
                    Droit à l&apos;image
                  </Typography>
                  <Typography
                    as={FormDescription}
                    className="col-start-2 row-start-2 max-w-[500px]"
                  >
                    autorise l&apos;association à utiliser et publier des
                    photos, vidéos, et tout autre support visuel ou document le
                    concernant, à des fins de communication, de promotion ou
                    d&apos;archivage, sur tous les supports (site web, réseaux
                    sociaux, brochures, etc.).
                  </Typography>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Theft loss Liability */}
          <FormField
            control={form.control}
            name="theftLossLiability"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClassName}>
                  <FormControl>
                    <Checkbox
                      className="col-start-1 row-start-2"
                      aria-required
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Typography as="span" className="col-start-2 row-start-1">
                    Déclinaison de responsabilité en cas de perte ou vol
                  </Typography>
                  <Typography
                    as={FormDescription}
                    className="col-start-2 row-start-2 max-w-[500px]"
                  >
                    note que l&apos;association décline toute responsabilité en
                    cas de perte, vol ou détérioration d&apos;objets personnels,
                    bijoux ou autres biens de valeur m&apos;appartenant, lors
                    des entraînements, compétitions ou autres événements
                    organisés par l&apos;association.
                  </Typography>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Refund */}
          <FormField
            control={form.control}
            name="refund"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClassName}>
                  <FormControl>
                    <Checkbox
                      className="col-start-1 row-start-2"
                      aria-required
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Typography as="span" className="col-start-2 row-start-1">
                    Absence de remboursement
                  </Typography>
                  <Typography
                    as={FormDescription}
                    className="col-start-2 row-start-2 max-w-[500px]"
                  >
                    accepte que l&apos;adhésion à l&apos;association est
                    définitive et non remboursable. Aucun remboursement, même
                    partiel, ne sera accordé en cas d&apos;abandon ou
                    d&apos;interruption de la pratique.
                  </Typography>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* internal rules */}
          <FormField
            control={form.control}
            name="internalRules"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClassName}>
                  <FormControl>
                    <Checkbox
                      className="col-start-1 row-start-2"
                      aria-required
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Typography as="span" className="col-start-2 row-start-1">
                    Certification de lecture et d&apos;acceptation du règlement
                    intérieur
                  </Typography>
                  <Typography
                    as={FormDescription}
                    className="col-start-2 row-start-2 max-w-[500px]"
                  >
                    certifie avoir pris connaissance du règlement intérieur de
                    l&apos;association et s&apos;engage à en respecter toutes
                    les dispositions.
                  </Typography>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Signature */}
          <FormField
            control={form.control}
            name="signature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Signature</FormLabel>
                <FormControl>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger className="relative flex min-h-28 w-full flex-col items-center justify-center gap-4 rounded-lg bg-accent p-4 transition-colors hover:bg-foreground/15">
                      {field.value ? (
                        <>
                          <div className="relative h-28 w-full">
                            <Image
                              src={field.value}
                              alt="signature"
                              className="object-contain"
                              fill
                            />
                          </div>
                          <Separator />
                        </>
                      ) : (
                        <>
                          <div className="flex justify-center gap-4">
                            <SignatureIcon />
                            <Typography as="span" className="font-medium">
                              Ajouter une signature
                            </Typography>
                          </div>
                          <Separator />
                        </>
                      )}
                    </DialogTrigger>
                    <SignatureDialogContent
                      getData={(data: string) => {
                        form.setValue("signature", data, {
                          shouldValidate: true,
                        });
                        setDialogOpen(false);
                      }}
                    />
                  </Dialog>
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

/* --------------------------------------------------------
 *                          Signature
   -------------------------------------------------------- */

function SignatureDialogContent({
  getData,
}: {
  getData: (data: string) => void;
}) {
  const ref = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleValidation = () => {
    getData(ref.current?.getTrimmedCanvas().toDataURL("image/png")!);
    setIsEmpty(true);
  };

  const handleOnBegin = () => {
    setIsEmpty(ref.current?.isEmpty()!);
  };

  const handleOnEnd = () => {
    setIsEmpty(ref.current?.isEmpty()!);
  };

  return (
    <DialogContent className="flex h-4/6 max-h-full max-w-full flex-col px-2 py-4 sm:w-4/6 sm:p-6 lg:w-[700px]">
      <DialogHeader className="h-fit">
        <DialogTitle className="text-center">Signature</DialogTitle>
        <DialogDescription />
      </DialogHeader>

      {/* Signature Pad */}
      <div
        className={
          "relative flex h-full w-fit justify-center rounded-xl bg-accent "
        }
      >
        <SignatureCanvas
          ref={ref}
          onBegin={handleOnBegin}
          onEnd={handleOnEnd}
          minWidth={1.5}
          canvasProps={{ className: "w-full h-full" }}
        />
        <Separator className="absolute bottom-1/3 w-11/12" />
        <Button
          variant="outline"
          className={cn(
            "absolute bottom-[10%] bg-neutral-200 transition-all dark:bg-neutral-900",
            isEmpty && "opacity-0",
          )}
          onClick={() => {
            ref.current?.clear();
            setIsEmpty(true);
          }}
        >
          Effacer
        </Button>
        <div className="absolute bottom-2 left-2 flex items-center gap-2 ">
          <Info className="h-5 w-5 fill-foreground/50 stroke-muted" />
          <Typography
            variant="small"
            className="text-xs font-normal text-foreground/50"
          >
            Signez avec le doigt
          </Typography>
        </div>
      </div>

      {/* Footer */}
      <DialogFooter className="h-fit sm:justify-end sm:self-end">
        <Button
          disabled={isEmpty}
          aria-disabled={isEmpty}
          onClick={handleValidation}
        >
          Terminer
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Annuler
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
