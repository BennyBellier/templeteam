"use client";

import { ReferencesProvider } from "@/components/references/ReferencesProvider";
import { SidebarProvider } from "@/components/sidebar/SidebarProvider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { type PropsWithChildren } from "react";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ReferencesProvider>
          <SidebarProvider>
            <Toaster />
            <SessionProvider>{children}</SessionProvider>
          </SidebarProvider>
        </ReferencesProvider>
      </ThemeProvider>
    </>
  );
};
