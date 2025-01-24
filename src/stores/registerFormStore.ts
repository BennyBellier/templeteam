import { Gender } from "@prisma/client";
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
  reset: () => set(defaultInitState),
}));

export const defaultNotUndefinedState: State = {
  courses: {},
  member: {
    photo: new File([], "placeholder.png"), // Default File
    firstname: "",
    lastname: "",
    birthdate: new Date("Invalid Date"), // Default invalid date
    gender: Gender.NotSpecified, // Use your Gender enum default
    address: "",
    city: "",
    postalCode: "",
    country: "",
  },
  legalGuardians: [
    {
      firstname: "",
      lastname: "",
      phone: "",
    },
  ],
  authorization: {
    emergencyAuthorization: false,
    travelAuthorization: false,
    imageRights: false,
    theftLossLiability: false,
    refund: false,
    internalRules: false,
    undersigner: "",
    signature: "",
  },
};

function createProxy<T extends object>(target: T, defaults: T): T {
  return new Proxy(target, {
    get(obj, prop) {
      // Retourne la valeur si elle existe dans l'objet, sinon retourne la valeur par défaut
      if (prop in obj) {
        return obj[prop as keyof T];
      }
      return defaults[prop as keyof T];
    },
  });
}

// Function to create a Proxy for the member with fallback defaults
export function createRegisterFormProxy(store: State): {
  courses: Record<string, boolean>;
  member: MemberState;
  legalGuardians: LegalGuardianState[];
  authorization: AuthorizationState;
} {
  const coursesProxy = createProxy(
    store.courses!,
    defaultNotUndefinedState.courses!,
  );

  const memberProxy = createProxy(
    store.member!,
    defaultNotUndefinedState.member!,
  );

  const legalGuardiansProxy = createProxy(
    store.legalGuardians!,
    defaultNotUndefinedState.legalGuardians!,
  );

  const authorizationProxy = createProxy(
    store.authorization!,
    defaultNotUndefinedState.authorization!,
  );

  return {
    ...store,
    courses: coursesProxy,
    member: memberProxy,
    legalGuardians: legalGuardiansProxy,
    authorization: authorizationProxy,
  };
}