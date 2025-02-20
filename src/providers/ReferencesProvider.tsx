'use client'

import { createContext, useContext, type FC, type PropsWithChildren } from 'react';
import type { References } from '@prisma/client';
import { trpc } from "@/trpc/TrpcProvider";

interface ReferencesContextType {
  references: References[] | undefined,
  isLoading: boolean,
};

const ReferencesContext = createContext<ReferencesContextType>({
  references: undefined,
  isLoading: false,
});

export function useReferences() {
  const context = useContext(ReferencesContext);
  if (!context) {
    throw new Error('useReferences must be used within a ReferencesProvider.');
  }
  return context;
}

export const ReferencesProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: references, isLoading } = trpc.references.getAll.useQuery();
 
  return (
    <ReferencesContext.Provider value={{ 
      references, 
      isLoading 
    }}>
      {children}
    </ReferencesContext.Provider>
  );
};
