import { create } from "zustand";
import type { References } from "@prisma/client";

export type ReferencesState = {
  references: References[];
  isInitialized: boolean;
  setReferences: (data: References[]) => void;
};

export const useReferencesStore = create<ReferencesState>((set) => ({
  references: [],
  isInitialized: false,
  setReferences: (data) => set({ references: data, isInitialized: true }),
}));
