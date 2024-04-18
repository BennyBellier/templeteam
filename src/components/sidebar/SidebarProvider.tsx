"use client";

import { createContext, useContext, useState } from "react";

export const SidebarContext = createContext({
  sidebarOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleSiberbarChange: (_state?: boolean) => {},
});

export function useSidebarState() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSiberbarChange = (_state = !sidebarOpen) => {
    setSidebarOpen(_state);
  };

  return (
    <SidebarContext.Provider value={{ sidebarOpen, handleSiberbarChange }}>
      {children}
    </SidebarContext.Provider>
  );
}
