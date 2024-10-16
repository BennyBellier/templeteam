import type { AuthorizationSchema } from "app/association/inscription/(StepForms)/Authorization";
import type { EmergencyContactSchema } from "app/association/inscription/(StepForms)/EmergencyContact";
import type { MedicSchema } from "app/association/inscription/(StepForms)/Medic";
import type { MemberSchema } from "app/association/inscription/(StepForms)/Member";
import type { MembershipSchema } from "app/association/inscription/(StepForms)/Membership";

import type { z } from "zod";
import { createStore } from "zustand/vanilla";

type State = {
  membership: {
    templeRun?: boolean;
    templeGym?: boolean;
    templeBreak?: boolean;
    templeGymJunior?: boolean;
  } | null;
  member: {
    picture: string;
    firstname: string;
    lastname: string;
    birthdate: string;
    gender: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    mail?: string | undefined;
    phoneNumber?: string | undefined;
  } | null;
  emergencyContact: {
    emergencyContactName1: string;
    emergencyContactPhone1: string;
    emergencyContactName2?: string | undefined;
    emergencyContactPhone2?: string | undefined;
  } | null;
  authorization: {
    undersigned: string;
    emergencyAuthorization: boolean;
    travelAuthorization: boolean;
    imageRights: boolean;
    theftLossLiability: boolean;
    refund: boolean;
    internalRules: boolean;
    signature: string;
  } | null;
  medic: {
    medicalCertificate: boolean;
    medicalComments?: string | undefined;
  } | null;
  isAdult: boolean | null;
};

type Actions = {
  setMembership: (membershipData: State["membership"]) => void;
  setMember: (memberData: State["member"]) => void;
  setEmergencyContact: (
    emergencyContactData: State["emergencyContact"],
  ) => void;
  setAuthorization: (authorizationData: State["authorization"]) => void;
  setMedic: (medicData: State["medic"]) => void;
  setAdult: (isAdult: boolean) => void;
};

export type RegisterFormStore = State & Actions;

export const defaultInitState: State = {
  membership: null,
  member: null,
  emergencyContact: null,
  authorization: null,
  medic: null,
  isAdult: null,
};

export const createRegisterFormStore = (
  initState: State = defaultInitState,
) => {
  return createStore<RegisterFormStore>()((set) => ({
    ...initState,
    setMembership: (membershipData) =>
      set(() => ({ membership: membershipData })),
    setMember: (memberData) => set(() => ({ member: memberData })),
    setEmergencyContact: (emergencyContactData) =>
      set(() => ({ emergencyContact: emergencyContactData })),
    setAuthorization: (authorizationData) =>
      set(() => ({ authorization: authorizationData })),
    setMedic: (medicData) => set(() => ({ medic: medicData })),
    setAdult: (isAdult) => set(() => ({ isAdult: isAdult })),
  }));
};
