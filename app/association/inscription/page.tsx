"use client";

import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Step, Stepper } from "@/components/ui/stepper";
import { RegisterFormStoreProvider } from "@/providers/RegisterFormProvider";
import Authorization from "./(StepForms)/Authorization";
import EmergencyContact from "./(StepForms)/EmergencyContact";
import MemberForm from "./(StepForms)/Member";
import MembershipForm from "./(StepForms)/Membership";
import Medic from "./(StepForms)/Medic";
// import { FormResume } from "./StepperFormActions";

const steps = [
  { label: "Adhésion" },
  { label: "Informations" },
  { label: "Contact d'urgence", optional: true, description: "optionel" },
  { label: "Médical" },
  { label: "Autorisations" },
  // { label: "Récapitulatif" },
];

export default function Register() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Pré-Inscription</LayoutTitle>
        <LayoutDescription>
          Vous souhaitez participez à nos cours, inscrivez-vous dès maintenant !
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="gap-6">
        <RegisterFormStoreProvider>
          <Stepper
            variant="line"
            initialStep={0}
            steps={steps}
            className="h-full w-full"
          >
            {steps.map((stepProps, index) => {
              if (index === 0) {
                return (
                  <Step key={stepProps.label} {...stepProps} className="w-full">
                    <MembershipForm />
                  </Step>
                );
              } else if (index === 1) {
                return (
                  <Step key={stepProps.label} {...stepProps}>
                    <MemberForm />
                  </Step>
                );
              } else if (index === 2) {
                return (
                  <Step key={stepProps.label} {...stepProps}>
                    <EmergencyContact />
                  </Step>
                );
              } else if (index === 3) {
                return (
                  <Step key={stepProps.label} {...stepProps}>
                    <Medic />
                  </Step>
                );
              } else {
                return (
                  <Step key={stepProps.label} {...stepProps}>
                    <Authorization />
                  </Step>
                );
              }
            })}
          </Stepper>
        </RegisterFormStoreProvider>
      </LayoutSection>
    </Layout>
  );
}
