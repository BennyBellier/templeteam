"use client";

import type { PropsWithChildren } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

export default function Resizable({
    children,
    defaultLayout = [3, 96],
    handleActive,
}: PropsWithChildren<{
  defaultLayout?: number[] | undefined;
  handleActive?: boolean | undefined;
}>) {
  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
  };
  return (
    <ResizablePanelGroup onLayout={onLayout} autoSaveId="resizableAdminPanel" direction="horizontal">
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        minSize={4}
        maxSize={15}
        className={cn("bg-card overflow-hidden flex flex-col gap-6", !handleActive && "border-border border-r")}
      ></ResizablePanel>
      {handleActive && <ResizableHandle /> }
      <ResizablePanel
        defaultSize={defaultLayout[1]}
        className="grid grow auto-rows-auto gap-6 pb-10 pt-5"
      >
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
