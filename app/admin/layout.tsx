import { AppSidebar } from "@/components/layout/sidebarAdmin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import FallbackError from "../error";

export default async function AdminLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar className="h-full" />
      <SidebarInset className="h-screen max-h-screen min-h-screen w-full">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger className="lg:hidden" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <ScrollArea className="max-h-full max-w-full">
          <div className="flex h-full flex-col gap-4 p-4">
            <ErrorBoundary FallbackComponent={FallbackError}>
              {children}
            </ErrorBoundary>
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
