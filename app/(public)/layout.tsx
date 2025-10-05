import { AppPublicSidebar } from "@/components/layout/app-sidebar";
import { ContextedScrollArea } from "@/components/ui/scroll-area";
import type { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import FallbackError from "../error";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import PublicProviders from "./providers";

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <PublicProviders>
      <div
        id="main-content"
        className="flex h-dvh max-h-dvh min-h-screen w-full flex-col overflow-hidden"
      >
        <ContextedScrollArea>
          <Header />
          <main className="grid grow auto-rows-auto gap-6 overflow-y-auto pb-10 pt-5">
            <ErrorBoundary FallbackComponent={FallbackError}>
              {children}
            </ErrorBoundary>
          </main>
          <Footer />
        </ContextedScrollArea>
      </div>
      <AppPublicSidebar />
    </PublicProviders>
  );
}
