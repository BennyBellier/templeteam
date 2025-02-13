"use client";

import { ContextedScrollArea } from "@/components/ui/scroll-area";
import type { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import FallbackError from "../error";
import { ReferencesProvider } from "@/providers/ReferencesProvider";
import { CarouselPhotosProvider } from "@/components/Photos/CarouselPhotosProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <ReferencesProvider>
      <CarouselPhotosProvider>
        <ContextedScrollArea>
          <Header />
          <main className="grid grow auto-rows-auto gap-6 overflow-y-auto pb-10 pt-5">
            <ErrorBoundary FallbackComponent={FallbackError}>
              {children}
            </ErrorBoundary>
          </main>
          <Footer />
        </ContextedScrollArea>
      </CarouselPhotosProvider>
    </ReferencesProvider>
  );
}
