"use client";

import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import Authorization from "./(StepForms)/Authorization";
import LegalGuardians from "./(StepForms)/LegalGuardians";
import Member from "./(StepForms)/Member";
import Courses from "./(StepForms)/Courses";
import { Resume } from "./StepperFormActions";
import { defineStepper } from "@stepperize/react";
import { useMediaQuery } from "usehooks-ts";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";

const { useStepper } = defineStepper(
  { index: 0, id: "courses", label: "Cours", optional: false },
  { index: 1, id: "informations", label: "Informations", optional: false },
  {
    index: 2,
    id: "legalGuardians",
    label: "Responsable légaux",
    optional: true,
  },
  { index: 3, id: "authorization", label: "Autorisations", optional: false },
  { index: 4, id: "resume", label: "Récapitulatif", optional: false },
);

function StepperAdvancement() {
  const stepper = useStepper();

  return (
    <ol className="flex w-full gap-2">
      {stepper.all.map((step, index) => (
        <li key={step.id} className="flex w-full flex-1 flex-col gap-0.5">
          <Separator
            className={cn(
              "h-0.5 w-full bg-border",
              index < stepper.current.index && "bg-blue-500",
            )}
          />
          <Typography as="span" className="w-fit text-[0.8rem] font-light">
            {step.label}
          </Typography>
          {step.optional && (
            <Typography as="span" variant="muted" className="w-fit text-xs">
              optionel
            </Typography>
          )}
        </li>
      ))}
    </ol>
  );
}

export default function Register() {
  const stepper = useStepper();
  const orientation = useMediaQuery("(max-with: 768px)");
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Inscription</LayoutTitle>
        <LayoutDescription>
          Vous souhaitez participez à nos cours, inscrivez-vous dès maintenant !
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="gap-6">
        <StepperAdvancement />
        <Card
          className={cn(
            "ease flex h-full flex-col overflow-hidden transition-transform duration-500",
          )}
        >
          {/* {stepper.switch({
            courses: () => <Courses />,
            informations: () => <Member />,
            legalGuardians: () => <LegalGuardians />,
            authorization: () => <Authorization />,
            resume: () => <Resume />,
          })} */}
          <CardFooter className={cn("h-12 w-full rounded-none p-0")}>
            {stepper.isFirst || stepper.isLast ? (
              <Button
                // type="submit"
                // form="registerForm"
                className="h-full w-full rounded-b-lg rounded-l-none rounded-t-none hover:scale-100 focus-visible:scale-100 disabled:opacity-100"
              >
                {stepper.isFirst && "Commencer"}
                {stepper.isLast && "Valider"}
              </Button>
            ) : null}
          </CardFooter>
        </Card>
      </LayoutSection>
    </Layout>
  );
}
