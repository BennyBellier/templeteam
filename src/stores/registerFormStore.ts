// import type { z } from "zod";
import { Prisma } from "@prisma/client";
import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";

const memberData = Prisma.validator<Prisma.MemberDefaultArgs>()({
  omit: {
    id: true,
    createdAt: true,
    updatedAt: true,
    photo: true,
  },
});

const legalGuardiansData = Prisma.validator<Prisma.LegalGuardianDefaultArgs>()({
  omit: {
    id: true,
    createdAt: true,
    updatedAt: true,
  },
});

const fileData = Prisma.validator<Prisma.FileDefaultArgs>()({
  omit: {
    id: true,
    createdAt: true,
    updatedAt: true,
    memberId: true,
    paymentMethod: true,
    paymentDetails: true,
    paymentAmout: true,
  },
});

type State = {
  courses: Record<string, boolean> | null;
  member:
    | (Prisma.MemberGetPayload<typeof memberData> & {
        photo: File | null;
      })
    | null;
  legalGuardians:
    | Prisma.LegalGuardianGetPayload<typeof legalGuardiansData>[]
    | null;
  file: Prisma.FileGetPayload<typeof fileData> | null;
  authorization: {
    emergencyAuthorization: boolean;
    travelAuthorization: boolean;
    imageRights: boolean;
    theftLossLiability: boolean;
    refund: boolean;
    internalRules: boolean;
    undersigner: string;
    signature: string;
  } | null;
  isAdult: boolean | null;
};

type Actions = {
  setCourses: (courses: State["courses"]) => void;
  setMember: (member: State["member"]) => void;
  setLegalGuardians: (legalGuardians: State["legalGuardians"]) => void;
  setFile: (file: State["file"]) => void;
  setAuthorization: (authorization: State["authorization"]) => void;
  setAdult: (isAdult: boolean) => void;
};

export type RegisterFormStore = State & Actions;

export const defaultInitState: State = {
  courses: null,
  member: null,
  legalGuardians: null,
  file: null,
  authorization: null,
  isAdult: null,
};

export const useRegisterFormStore = createStore<RegisterFormStore>()(
  persist(
    (set, get) => ({
      ...defaultInitState,
      setCourses: (courses) => set(() => ({ courses })),
      setMember: (member) => set(() => ({ member })),
      setLegalGuardians: (legalGuardians) => set(() => ({ legalGuardians })),
      setFile: (file) => set(() => ({ file })),
      setAuthorization: (authorization) => set(() => ({ authorization })),
      setAdult: (isAdult) => set(() => ({ isAdult })),
    }),
    {
      name: "register-form-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
