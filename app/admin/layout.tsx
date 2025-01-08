import { AppSidebar } from "@/components/layout/sidebarAdmin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import FallbackError from "../error";

export default async function AdminLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar className="h-full" />
      <SidebarInset className="w-full h-full">
        <div className="flex flex-col gap-4 p-4 max-h-full grow-0">
          <ErrorBoundary FallbackComponent={FallbackError}>
            {children}
          </ErrorBoundary>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
