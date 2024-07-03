"use client";

import { trpc } from "@/trpc/TrpcProvider";
import type { References } from "@prisma/client";
import { createContext, useContext } from "react";

const ReferencesContext = createContext<References[]>([]);

export function useReferences() {
  return useContext(ReferencesContext);
}

export const ReferencesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, error } = trpc.references.getAll.useQuery();

  if (error) {
    console.error(error);
  }

  return (
    <ReferencesContext.Provider value={data ?? []}>
      {children}
    </ReferencesContext.Provider>
  );
};
