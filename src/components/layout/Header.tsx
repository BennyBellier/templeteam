"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ThemeToggle,
  ThemeToggleSidebar,
} from "@/components/theme/ThemeToggle";
import { NavigationBar, NavigationSidebar } from "@/components/ui/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useContext } from "react";
import { Typography } from "../ui/typography";
import { ThemedLogo } from "../ui/logo";
import { SidebarContext } from "../sidebar/SidebarProvider";
import { Hamburger } from "../ui/hamburger";

export function Navigation() {
  return (
    <>
      <NavigationBar className="hidden lg:flex" />
      <NavigationSidebar className="flex w-full lg:hidden" />
    </>
  );
}

export function Header() {
  const { sidebarOpen } = useContext(SidebarContext);

  useEffect(() => {
    function detectScroll() {
      document.documentElement.dataset.scroll = window.scrollY.toFixed();
    }

    window.addEventListener("scroll", detectScroll);

    return () => {
      window.removeEventListener("scroll", detectScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "group-[:not([data-scroll='0'])]/html top-0 z-40 px-2",
        "flex w-full items-center justify-between bg-background transition-shadow duration-200",
        "lg:items-center lg:p-1050",
        "h-[60px] md:h-[70px] lg:h-[80px]",
      )}
    >
      <Typography
        as={Link}
        href="/"
        variant="h2"
        className="inline-flex items-end gap-0.5"
      >
        <ThemedLogo
          sizes="(max-width 648px) 50px, (max-width 768px) 60px, 70px"
          className="h-[50px] w-[50px] object-contain md:h-[60px] md:w-[60px] lg:h-[70px] lg:w-[70px]"
        />
        Temple Team
      </Typography>

      <Hamburger className="lg:hidden" />

      <div
        className={cn(
          "absolute left-0 top-[60px] flex h-full max-h-screen w-screen flex-col gap-5",
          "items-center justify-start bg-background px-5 md:top-[70px]",
          "lg:static lg:h-full lg:w-fit lg:flex-row lg:px-0",
          "transition-transform duration-1000 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <Navigation />
        <ThemeToggle className="hidden lg:inline-flex hover:bg-transparent" />
        <ThemeToggleSidebar className="inline-flex w-full justify-around lg:hidden" />
      </div>
    </header>
  );
}
