import { AppAdminSidebar } from "@/components/layout/admin/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SeasonsProvider } from "@/providers/SeasonProvider";
import { prisma } from "@/trpc/server";
import type { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import FallbackError from "./error";
// import { Separator } from "@/components/ui/separator";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const { seasons, currentSeason } = await prisma.association.getSeasons();

  return (
    <SeasonsProvider
      initialSeasons={seasons}
      InitialCurrentSeason={currentSeason}
    >
      <SidebarProvider>
          <AppAdminSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b">
              <div className="flex items-center gap-2 px-3">
                <SidebarTrigger />
                {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
              </div>
            </header>
            <ErrorBoundary FallbackComponent={FallbackError}>
              {children}
            </ErrorBoundary>
          </SidebarInset>
      </SidebarProvider>
    </SeasonsProvider>
  );
}
