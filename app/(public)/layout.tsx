"use client";

import type { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import FallbackError from "../error"

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="grid grow auto-rows-auto gap-6 pb-10 pt-5">
        <ErrorBoundary FallbackComponent={FallbackError}>{children}</ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
