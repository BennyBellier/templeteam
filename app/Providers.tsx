"use client";

import React, { type PropsWithChildren } from 'react';
import { CarouselPhotosProvider } from "@/components/Photos/CarouselPhotosProvider";
import { ReferencesProvider } from "@/providers/ReferencesProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";


export default function Providers({ children } : PropsWithChildren) {
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