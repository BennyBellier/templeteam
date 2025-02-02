"use client";

import { CarouselPhotosProvider } from "@/components/Photos/CarouselPhotosProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebarCustom";
import { Toaster } from "@/components/ui/toaster";
import { ReferencesProvider } from "@/providers/ReferencesProvider";
import { type PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider defaultOpen={false}>
        <ReferencesProvider>
          <CarouselPhotosProvider>
            <Toaster />
            {children}
          </CarouselPhotosProvider>
        </ReferencesProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
