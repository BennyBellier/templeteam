"use client";

import { prisma } from "@/lib/server";
import { Prisma, References } from "@prisma/client";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { useEffectOnce } from "usehooks-ts";

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
      const fetchedReferences = await prisma.references.get.query();
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

export type ReferenceCardProps = Prisma.PromiseReturnType<
  typeof prisma.references.get.query
>[number];
