"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Typography } from "../ui/typography";

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

export function ThemeToggleSidebar() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="themeSidebar"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Typography className="w-48 font-caption text-lg font-bold dark:hidden">
        Thème sombre
      </Typography>
      <Typography className="w-48 font-caption text-lg font-bold hidden dark:block">
        Thème clair
      </Typography>
      <Sun className="h-6 w-6 dark:hidden" />
      <Moon className="hidden h-6 w-6 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
