"use client";

import { CarouselPhotosProvider } from "@/components/Photos/CarouselPhotosProvider";
import { SidebarProvider } from "@/components/sidebar/SidebarProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { type ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SidebarProvider>
          <CarouselPhotosProvider>
            <Toaster />
            {children}
          </CarouselPhotosProvider>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
}
