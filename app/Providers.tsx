"use client";

import { SidebarProvider } from "@/components/sidebar/SidebarProvider";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Suspense, type PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {/* <Suspense fallback={<h1>Loading...</h1>}> */}
          <SidebarProvider>
            <Toaster />
            <SessionProvider>{children}</SessionProvider>
          </SidebarProvider>
        {/* </Suspense> */}
      </ThemeProvider>
    </>
  );
};
