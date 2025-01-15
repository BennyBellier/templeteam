"use client";

import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
// import { RegisterFormStoreProvider } from "@/providers/RegisterFormProvider";
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

const { useStepper } = defineStepper(
  { index: 0, id: "courses", label: "Cours", optional: false },
  { index: 1, id: "informations", label: "Informations", optional: false },
  { index: 2, id: "legalGuardians", label: "Responsable légaux", optional: true },
  { index: 3, id: "authorization", label: "Autorisations", optional: false },
  { index: 4, id: "resume", label: "Récapitulatif", optional: false },
);

export default function Register() {
  const stepper = useStepper();
  const orientation = useMediaQuery("(max-with)")
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Inscription</LayoutTitle>
        <LayoutDescription>
          Vous souhaitez participez à nos cours, inscrivez-vous dès maintenant !
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="gap-6">
        <ol className="flex w-full gap-2">
          {stepper.all.map((step, index) => (
            <li key={step.id} className="w-full flex-1 flex flex-col gap-0.5">
              <Separator
                className={cn(
                  "h-0.5 w-full bg-border",
                  index < stepper.current.index && "bg-blue-500",
                )}
              />
              <Typography as="span" className="text-[0.8rem] font-light w-fit">
                {step.label}
              </Typography>
              {step.optional && (
                <Typography as="span" variant="muted" className="text-xs w-fit">
                  optionel
                </Typography>
              )}
            </li>
          ))}
        </ol>
        <div>
          {/* {stepper.switch({
            courses: () => <Courses />,
            informations: () => <Member />,
            legalGuardians: () => <LegalGuardians />,
            authorization: () => <Authorization />,
            resume: () => <Resume />,
          })} */}
        </div>
      </LayoutSection>
    </Layout>
  );
}
