"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface ReferenceCategoryContextValue {
  category: number | null;
  setCategory: React.Dispatch<React.SetStateAction<number | null>>;
}

/*
  Context for export Category selector out of page !
*/
const ReferenceCategoryContext = createContext<
  ReferenceCategoryContextValue | undefined
>(undefined);

export function useReferenceCategory() {
  const context = useContext(ReferenceCategoryContext);
  if (context === undefined) {
    throw new Error(
      "useReferenceCategory must be inside a ReferenceCategoryProvider",
    );
  }
  return context;
}

export const ReferenceCategoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [category, setCategory] = useState<number | null>(null);

  return (
    <ReferenceCategoryContext.Provider value={{ category, setCategory }}>
      {children}
    </ReferenceCategoryContext.Provider>
  );
};

export default function ReferenceLayout({ children }: { children: ReactNode }) {
  return <ReferenceCategoryProvider>{children}</ReferenceCategoryProvider>;
}
