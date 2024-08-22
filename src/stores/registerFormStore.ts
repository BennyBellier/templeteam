import { createStore } from "zustand/vanilla";
import type {
  FirstFormSchema,
  FourthFormSchema,
  SecondFormSchema,
  ThirdFormSchema,
} from "/app/association/inscription/StepForm";

type State = {
  firstFormPart: FirstFormSchema;
  secondFormPart: SecondFormSchema;
  thirdFormPart: ThirdFormSchema;
  fourthFormPart: FourthFormSchema;
  isAdult: boolean | null;
};

type Actions = {
  setFirstFormPart: (firstFormData: State["firstFormPart"]) => void;
  setSecondFormPart: (secondFormData: State["secondFormPart"]) => void;
  setThirdFormPart: (thirdFormData: State["thirdFormPart"]) => void;
  setFourthFormPart: (fourthFormData: State["fourthFormPart"]) => void;
  setAdult: (isAdult: boolean) => void;
};

export type RegisterFormStore = State & Actions;

export const defaultInitState: State = {
  firstFormPart: null,
  secondFormPart: null,
  thirdFormPart: null,
  fourthFormPart: null,
  isAdult: null,
};

export const createRegisterFormStore = (
  initState: State = defaultInitState,
) => {
  return createStore<RegisterFormStore>()((set) => ({
    ...initState,
    setFirstFormPart: (firstFormData) =>
      set(() => ({ firstFormPart: firstFormData })),
    setSecondFormPart: (secondFormData) =>
      set(() => ({ secondFormPart: secondFormData })),
    setThirdFormPart: (thirdFormData) =>
      set(() => ({ thirdFormPart: thirdFormData })),
    setFourthFormPart: (fourthFormData) =>
      set(() => ({ fourthFormPart: fourthFormData })),
    setAdult: (isAdult) => set(() => ({ isAdult: isAdult })),
  }));
};
