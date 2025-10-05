"use client";


import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { type PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster />
            {children}
    </ThemeProvider>
  );
}
