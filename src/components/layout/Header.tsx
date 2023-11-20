import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Navigation } from "@/components/ui/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className={cn("sticky top-0 z-40 w-full bg-background flex justify-around")}>
      <Navigation />

      <ThemeToggle />
    </header>
  );
}
