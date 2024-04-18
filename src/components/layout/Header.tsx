"use client";

import {
  ThemeToggle,
  ThemeToggleSidebar,
} from "@/components/theme/ThemeToggle";
import { NavigationBar, NavigationSidebar } from "@/components/ui/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSidebarState } from "../sidebar/SidebarProvider";
import { Hamburger } from "../ui/hamburger";
import { ThemedLogo } from "../ui/logo";
import { Typography } from "../ui/typography";

export function Navigation() {
  return (
    <>
      <NavigationBar className="hidden lg:flex" />
      <NavigationSidebar className="flex w-full lg:hidden" />
    </>
  );
}

export function Header() {
  const { sidebarOpen, handleSiberbarChange } = useSidebarState();
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    handleSiberbarChange(false);

    const mainContentDiv = document.getElementById("main-content")!;

    const handleScroll = () => {
      setScrollY(mainContentDiv.scrollTop);
    };

    mainContentDiv.addEventListener("scroll", handleScroll);

    return () => mainContentDiv.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 px-2",
        "ease flex w-full items-center justify-between bg-background transition-shadow duration-300",
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

      <Hamburger className="outline-none focus:outline-none lg:hidden" />

      <div
        className={cn(
          "absolute left-0 top-[59px] flex h-screen max-h-screen w-screen flex-col gap-5",
          "items-center justify-start bg-background px-5 md:top-[69px]",
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
