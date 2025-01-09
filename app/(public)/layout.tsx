"use client";

import type { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import FallbackError from "../error";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <ScrollArea>
      <Header />
      <main className="grid grow auto-rows-auto gap-6 pb-10 pt-5 overflow-y-auto">
        <ErrorBoundary FallbackComponent={FallbackError}>{children}</ErrorBoundary>
      </main>
      <Footer />
    </ScrollArea>
  );
}
