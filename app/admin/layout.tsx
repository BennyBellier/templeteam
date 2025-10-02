import { AppSidebar } from "@/components/layout/sidebarAdmin";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import type { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import FallbackError from "./error";

export default async function AdminLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar className="max-h-full" />
      <SidebarInset className="max-h-full">
        <div className="flex max-h-full grow-0 flex-col gap-4 p-4">
          <ErrorBoundary FallbackComponent={FallbackError}>
            {children}
          </ErrorBoundary>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
