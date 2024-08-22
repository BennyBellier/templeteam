"use client";

import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Step, Stepper, useStepper } from "@/components/ui/stepper";
import { RegisterFormStoreProvider } from "@/providers/RegisterFormProvider";
import {
  FirstStepForm,
  FourthStepForm,
  SecondStepForm,
  ThirdStepForm,
} from "./StepForm";

const steps = [
  { label: "Choix de l'adhésion" },
  { label: "Informations personnels" },
  { label: "informations complémentaires" },
  { label: "Certificat médical" },
];

export default function Register() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Inscription</LayoutTitle>
        <LayoutDescription>
          Vous souhaitez participez à nos cours, inscrivez-vous dès maintenant !
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="gap-6">
        <RegisterFormStoreProvider>
          <Stepper
            variant="line"
            initialStep={3}
            steps={steps}
            className="h-full w-full"
          >
            {steps.map((stepProps, index) => {
              if (index === 0) {
                return (
                  <Step key={stepProps.label} {...stepProps} className="w-full">
                    <FirstStepForm />
                  </Step>
                );
              } else if (index === 1) {
                return (
                  <Step key={stepProps.label} {...stepProps}>
                    <SecondStepForm />
                  </Step>
                );
              } else if (index === 2) {
                return (
                  <Step key={stepProps.label} {...stepProps}>
                    <ThirdStepForm />
                  </Step>
                );
              } else {
                return (
                  <Step key={stepProps.label} {...stepProps}>
                    <FourthStepForm />
                  </Step>
                );
              }
            })}
            {/* <MyStepperFooter /> */}
          </Stepper>
        </RegisterFormStoreProvider>
      </LayoutSection>
    </Layout>
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
