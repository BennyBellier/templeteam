"use client"

import { defineStepper } from "@stepperize/react";
import {
  CoursesSchema,
  LegalGuardiansSchema,
  MemberSchema,
  AuthorizationSchema,
  ResumeSchema,
} from "./schemas";


export const { useStepper } = defineStepper(
  {
    index: 0,
    id: "courses",
    label: "Cours",
    schema: CoursesSchema,
  },
  {
    index: 1,
    id: "informations",
    label: "Informations",
    schema: MemberSchema,
  },
  {
    index: 2,
    id: "legalGuardians",
    label: "Responsable légaux",
    schema: LegalGuardiansSchema,
  },
  {
    index: 3,
    id: "authorization",
    label: "Autorisations",
    schema: AuthorizationSchema,
  },
  {
    index: 4,
    id: "resume",
    label: "Récapitulatif",
    schema: ResumeSchema,
  },
);