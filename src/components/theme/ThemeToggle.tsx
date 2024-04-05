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

export function ThemeToggleSidebar({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="themeSidebar"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={"h-16 md:h-24 " + className}
    >
      <Typography className="font-caption hidden w-48 text-3xl font-bold dark:block md:text-4xl">
        Thème clair
      </Typography>
      <Typography className="font-caption w-48 text-3xl font-bold dark:hidden md:text-4xl">
        Thème sombre
      </Typography>
      <Sun className="h-[2.25rem] w-[1.95rem] dark:hidden" />
      <Moon className="hidden h-9 w-9 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
