/* import { createContext, useContext } from "react";
import { getReferences } from "~/lib/references";
import { type ReferenceProps } from "~/utils/types";

const ReferencesContext = createContext({ references });

export function useReferences(): ReferenceProps[] {
  return useContext(ReferencesContext);
}

export function ReferencesContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const references = getReferences();
  return (
    <ReferencesContext.Provider value={references}>
      {children}
    </ReferencesContext.Provider>
  );
}
 */