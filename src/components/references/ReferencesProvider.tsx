"use client";

import { api } from "@/lib/server";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { References, ReferenceCategory } from "@prisma/client";


export const ReferencesContext = createContext({
  references: {} as References[] | null,
  fetchReferences: async () => {},
});

export function useReferences() {
  return useContext(ReferencesContext);
}

export const ReferencesProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [references, setReferences] = useState<References[] | null>(null);

  const fetchReferences = async () => {
    try {
      const fetchedReferences = await api.references.get.query();
      setReferences(fetchedReferences);
    } catch (error) {
      console.error("Query references failed: ", error);
    }
  };

  useEffectOnce(() => {
    if (references === null) fetchReferences();
  });

  return (
    <ReferencesContext.Provider value={{ references, fetchReferences }}>
      {children}
    </ReferencesContext.Provider>
  );
};
