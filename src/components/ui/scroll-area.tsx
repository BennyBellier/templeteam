"use client"

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

type ScrollAreaContextType = {
  scrollTo: (x: number, y: number, behavior?: ScrollBehavior) => void;
};

const ScrollAreaContext = React.createContext<
  ScrollAreaContextType | undefined
>(undefined);

export const useScrollArea = () => {
  const context = React.useContext(ScrollAreaContext);
  if (!context) {
    throw new Error("useScrollArea must be used within a ScrollAreaProvider");
  }
  return context;
};

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    viewportId?: string;
  }
>(({ className, children, viewportId, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      id={viewportId}
      className="h-full w-full rounded-[inherit]"
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

const ContextedScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    viewportId?: string;
  }
>(({ className, children, viewportId, ...props }, ref) => {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);

  // Fonction pour effectuer un défilement dans le viewport
  const scrollTo = React.useCallback(
    (x: number, y: number, behavior: ScrollBehavior = "smooth") => {
      if (viewportRef.current) {
        viewportRef.current.scrollTo({ top: y, left: x, behavior });
      }
    },
    [],
  );

  return (
    <ScrollAreaContext.Provider value={{ scrollTo }}>
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          id={viewportId}
          className="h-full w-full rounded-[inherit]"
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    </ScrollAreaContext.Provider>
  );
});
ContextedScrollArea.displayName = "ContextedScrollArea";

export { ScrollArea, ScrollBar, ContextedScrollArea };
