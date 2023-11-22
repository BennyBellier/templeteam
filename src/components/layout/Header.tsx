import Image from "next/image";
import Link from "next/link";
import { ThemeToggle, ThemeToggleSidebar } from "@/components/theme/ThemeToggle";
import { NavigationBar, NavigationSidebar } from "@/components/ui/navigation";
import { cn } from "@/lib/utils";

export function Navigation() {
  return (
    <>
      <NavigationBar className="hidden lg:flex" />
      <NavigationSidebar className="lg:hidden flex" />
    </>
  );
}

export function Header() {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex w-full justify-around bg-background",
      )}
    >
      {/* Link with logo */}

      <div className="flex gap-5 flex-col lg:flex-row">
        <Navigation />
        <ThemeToggle className="hidden lg:inline-flex"/>
        <ThemeToggleSidebar className="inline-flex " />
      </div>
    </header>
  );
}
