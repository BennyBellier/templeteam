// import type { z } from "zod";
import { Course, Member } from "@prisma/client";
import { Prisma } from '@prisma/client';
import { createStore } from "zustand/vanilla";

const memberInformations = Prisma.validator<Prisma.MemberDefaultArgs>({
  omit: {
    createdAt: true,
    updatedAt: true,
  },
});

type StateBis = {
  courses: Pick<Course, 'id'>;
  member: typeof memberInformations;
}

type State = {
  membership: {
    templeRun?: boolean;
    templeGym?: boolean;
    templeBreak?: boolean;
    templeGymJunior?: boolean;
  } | null;
  member: {
    photo: string;
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
  legalGuardians: {
    legalGuardiansName1: string;
    legalGuardiansPhone1: string;
    legalGuardiansName2?: string | undefined;
    legalGuardiansPhone2?: string | undefined;
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
  setlegalGuardians: (
    legalGuardiansData: State["legalGuardians"],
  ) => void;
  setAuthorization: (authorizationData: State["authorization"]) => void;
  setMedic: (medicData: State["medic"]) => void;
  setAdult: (isAdult: boolean) => void;
};

export type RegisterFormStore = State & Actions;

export const defaultInitState: State = {
  membership: null,
  member: null,
  legalGuardians: null,
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
    setlegalGuardians: (legalGuardiansData) =>
      set(() => ({ legalGuardians: legalGuardiansData })),
    setAuthorization: (authorizationData) =>
      set(() => ({ authorization: authorizationData })),
    setMedic: (medicData) => set(() => ({ medic: medicData })),
    setAdult: (isAdult) => set(() => ({ isAdult: isAdult })),
  }));
};
