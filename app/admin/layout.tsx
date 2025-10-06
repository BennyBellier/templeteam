import { AppAdminSidebar } from "@/components/layout/admin/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SeasonsProvider } from "@/providers/SeasonProvider";
import { auth } from "@/server/auth";
import { prisma } from "@/trpc/server";
import { headers } from "next/headers";
import type { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import FallbackError from "./error";
import { redirect } from "next/navigation";
// import { Separator } from "@/components/ui/separator";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const { seasons, currentSeason } = await prisma.association.getSeasons();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

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
