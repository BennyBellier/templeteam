"use client";

import { createContext, useState } from "react";

export const SidebarContext = createContext({ sidebarOpen: false, handleSiberbarChange: () => {} });

export function SidebarProvider({ children } : { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSiberbarChange = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ sidebarOpen, handleSiberbarChange }}>
      {children}
    </SidebarContext.Provider>
  );
}
