"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ThemedLogo } from "@/components/ui/logo";
import { NavigationBar } from "@/components/ui/navigation";
import { SidebarTrigger } from "@/components/ui/sidebarCustom";
import { Typography } from "@/components/ui/typography";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const isMobile = useIsMobile();
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
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
        "sticky top-0 z-[90] px-2",
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

      {isMobile ? (
        <SidebarTrigger />
      ) : (
        <>
          <NavigationBar className="hidden lg:flex" />
          <ThemeToggle className="hidden hover:bg-transparent lg:inline-flex" />
        </>
      )}

      {/* <div className={cn("hidden lg:static lg:h-full lg:w-fit lg:flex-row lg:px-0")}> */}
      {/* <NavigationBar className="hidden lg:flex" />
        <ThemeToggle className="hidden hover:bg-transparent lg:inline-flex" /> */}
      {/* </div> */}
    </header>
  );
}
