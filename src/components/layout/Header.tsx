"use client";

import {
  ThemeToggle,
  ThemeToggleSidebar,
} from "@/components/theme/ThemeToggle";
import { NavigationBar, NavigationSidebar } from "@/components/ui/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSidebarState } from "../sidebar/SidebarProvider";
import { Hamburger } from "../ui/hamburger";
import { ThemedLogo } from "../ui/logo";
import { Typography } from "../ui/typography";
import { useEffect, useState } from "react";

export function Navigation() {
  return (
    <>
      <NavigationBar className="hidden lg:flex" />
      <NavigationSidebar className="flex w-full lg:hidden" />
    </>
  );
}

export function Header() {
  const { sidebarOpen } = useSidebarState();
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-40 px-2",
        "flex w-full items-center justify-between bg-background transition-shadow ease duration-300",
        "lg:items-center lg:px-1050",
        "h-[60px] py-[10px] md:h-[70px] lg:h-[80px]",
        scrollY > 0 ? "shadow-md" : "",
      )}
    >
      <Typography
        as={Link}
        href="/"
        variant="h2"
        className="inline-flex items-end whitespace-nowrap text-2xl"
      >
        <ThemedLogo
          sizes="(max-width 648px) 50px, (max-width 768px) 60px, 70px"
          className="h-[50px] object-contain md:h-[60px] lg:h-[70px]"
        />
        <span className="-translate-x-4 translate-y-1 md:-translate-x-3 lg:-translate-x-2">
          emple Team
        </span>
      </Typography>

      <Hamburger className="lg:hidden" />

      <div
        className={cn(
          "absolute left-0 top-[60px] flex h-screen max-h-screen w-screen flex-col gap-5",
          "items-center justify-start bg-background px-5 md:top-[70px]",
          "lg:static lg:h-full lg:w-fit lg:flex-row lg:px-0",
          "transition-transform duration-1000 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <Navigation />
        <ThemeToggle className="hidden hover:bg-transparent lg:inline-flex" />
        <ThemeToggleSidebar className="inline-flex w-full justify-around lg:hidden" />
      </div>
    </header>
  );
}
