import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Typography } from "@/components/ui/Typography";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className={cn("sticky top-0 z-40 w-full bg-background flex")}>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/">
              Accueil
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/la-team">
              La Team
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Portfolio</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/portfolio/photos">Photos</NavigationMenuLink>
              <NavigationMenuLink href="/portfolio/videos">Vidéos</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink href="/contact">
              Contact
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/blog">
              Blog
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/references">
              Références
            </NavigationMenuLink>
          </NavigationMenuItem>


          <NavigationMenuItem>
            <NavigationMenuTrigger>Association</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/association">Accueil</NavigationMenuLink>
              <NavigationMenuLink href="/association/stage">Stage</NavigationMenuLink>
              <NavigationMenuLink href="/association/samedi_sportif">Samedi Sportif</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <ThemeToggle />
    </header>
  );
}
