"use client";

import { type PropsWithChildren } from "react";
import { ReferencesProvider } from "@/providers/ReferencesProvider";
import { CarouselPhotosProvider } from "@/components/Photos/CarouselPhotosProvider";
import { SidebarProvider } from "@/components/ui/sidebarCustom";

export default function PublicProviders({ children }: PropsWithChildren) {
  return (
    <SidebarProvider defaultOpen={false}>
      <ReferencesProvider>
        <CarouselPhotosProvider>{children}</CarouselPhotosProvider>
      </ReferencesProvider>
    </SidebarProvider>
  );
}
