// import type { z } from "zod";
import { type Gender } from "@prisma/client";
import { create } from "zustand";

type MemberState = {
  photo: File;
  firstname: string;
  lastname: string;
  birthdate: Date;
  gender: Gender;
  mail?: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  medicalComment?: string;
};

type LegalGuardianState = {
  firstname: string;
  lastname: string;
  phone: string;
  mail?: string;
};

type AuthorizationState = {
  emergencyAuthorization: boolean;
  travelAuthorization: boolean;
  imageRights: boolean;
  theftLossLiability: boolean;
  refund: boolean;
  internalRules: boolean;
  undersigner: string;
  signature: string;
};

type State = {
  courses?: Record<string, boolean>;
  member?: MemberState;
  legalGuardians?: LegalGuardianState[];
  authorization?: AuthorizationState;
};

type Actions = {
  setCourses: (courses: State["courses"]) => void;
  setMember: (member: State["member"]) => void;
  setLegalGuardians: (legalGuardians: State["legalGuardians"]) => void;
  setAuthorization: (authorization: State["authorization"]) => void;
  reset: () => void;
};

export type RegisterFormStore = State & Actions;

export const defaultInitState: State = {
  courses: undefined,
  member: undefined,
  legalGuardians: undefined,
  authorization: undefined,
};

export const useRegisterFormStore = create<RegisterFormStore>((set) => ({
  ...defaultInitState,
  setCourses: (courses) => set(() => ({ courses })),
  setMember: (member) => set(() => ({ member })),
  setLegalGuardians: (legalGuardians) => set(() => ({ legalGuardians })),
  setAuthorization: (authorization) => set(() => ({ authorization })),
  reset: () => set(() => defaultInitState),
}));
