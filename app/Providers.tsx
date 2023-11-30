"use client";

import { SidebarProvider } from "@/components/sidebar/SidebarProvider";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { type PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SidebarProvider>
          <Toaster />
          <SessionProvider>{children}</SessionProvider>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
};
