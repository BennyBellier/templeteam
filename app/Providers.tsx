"use client";


import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebarCustom";
import { Toaster } from "@/components/ui/toaster";
import { type PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider defaultOpen={false}>
       
            <Toaster />
            {children}
          
      </SidebarProvider>
    </ThemeProvider>
  );
}
