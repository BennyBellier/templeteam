"use client";

import { CarouselPhotosProvider } from "@/components/Photos/CarouselPhotosProvider";
import { ReferencesProvider } from "@/providers/ReferencesProvider";
import { SidebarProvider } from "@/components/sidebar/SidebarProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { type ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SidebarProvider>
          <ReferencesProvider>
          <CarouselPhotosProvider>
            <Toaster />
            {children}
          </CarouselPhotosProvider>
          </ReferencesProvider>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
}
