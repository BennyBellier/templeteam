"use client";

import {
  Layout,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Step, Stepper, useStepper } from "@/components/ui/stepper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { isValidPhoneNumber } from "react-phone-number-input";

const steps = [
  { label: "Step 1", description: "Description 1" },
  { label: "Step 2", description: "Description 2" },
];

export default function StepperForm() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Playground</LayoutTitle>
      </LayoutHeader>
      <LayoutSection>
        <Stepper variant="line" initialStep={0} steps={steps}>
          {steps.map((stepProps, index) => {
            if (index === 0) {
              return (
                <Step key={stepProps.label} {...stepProps}>
                  <FirstStepForm />
                </Step>
              );
            }
            return (
              <Step key={stepProps.label} {...stepProps}>
                <SecondStepForm />
              </Step>
            );
          })}
          <MyStepperFooter />
        </Stepper>
      </LayoutSection>
    </Layout>
  );
}

const FirstFormSchema = z.object({
  firstname: z.string({ required_error: "Veuillez saisir votre prénom." }),
  /* lastname: z.string({ required_error: "Veuillez saisir votre nom." }),
  birthdate: z
    .date({
      required_error: "Veuillez saisir votre date de naissance.",
    })
    .max(new Date(), { message: "Veuillez saisir une date correcte" }),
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
  country: z.string({ required_error: "Veuillez saisir le pays." }), */
});

function FirstStepForm() {
  const { nextStep } = useStepper();

  const form = useForm<z.infer<typeof FirstFormSchema>>({
    resolver: zodResolver(FirstFormSchema),
    defaultValues: {
      firstname: "",
    },
  });

  function onSubmit(_data: z.infer<typeof FirstFormSchema>) {
    nextStep();
    console.log(_data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepperFormActions />
      </form>
    </Form>
  );
}

const SecondFormSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

function SecondStepForm() {
  const { nextStep } = useStepper();

  const form = useForm<z.infer<typeof SecondFormSchema>>({
    resolver: zodResolver(SecondFormSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(_data: z.infer<typeof SecondFormSchema>) {
    nextStep();
    toast({
      title: "Second step submitted!",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>This is your private password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepperFormActions />
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
  } = useStepper();

  return (
    <div className="flex w-full justify-end gap-2">
      {hasCompletedAllSteps ? (
        <Button size="sm" type="button" onClick={resetSteps}>
          Reset
        </Button>
      ) : (
        <>
          <Button
            disabled={isDisabledStep}
            onClick={prevStep}
            size="sm"
            variant="secondary"
            type="button"
          >
            Prev
          </Button>
          <Button size="sm" type="submit">
            {isLastStep ? "Finish" : "Next"}
          </Button>
        </>
      )}
    </div>
  );
}

function MyStepperFooter() {
  const { activeStep, resetSteps, steps } = useStepper();

  if (activeStep !== steps.length) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button onClick={resetSteps}>Reset Stepper with Form</Button>
    </div>
  );
}
