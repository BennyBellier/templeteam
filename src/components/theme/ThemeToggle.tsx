"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Typography } from "../ui/typography";
import { Span } from "next/dist/trace";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={className}
    >
      <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function ThemeToggleSidebar({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="themeSidebar"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={"h-12 " + className}
    >
      <Sun className="h-[2.25rem] w-[1.95rem] dark:hidden" />
      <Moon className="hidden h-9 w-9 dark:block" />
      <Typography className="hidden dark:block text-2xl w-48">Thème clair</Typography>
      <Typography className="dark:hidden text-2xl w-48">Thème sombre</Typography>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
