"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import {
  Youtube,
  Instagram,
  Facebook,
  Mail,
  Languages,
  ChevronDownIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationLinks } from "@/lib/site-config";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cva } from "class-variance-authority";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "../theme/ThemeToggle";

const socialLinksClass = cva(
  "group flex h-14 w-14 items-center justify-center rounded-full border border-footer-foreground transition-colors duration-200 hover:bg-footer-foreground focus:bg-footer-foreground focus:outline-none",
);

const socialLinksIconClass = cva(
  "h-8 w-8 text-footer-foreground transition-colors duration-200 group-hover:text-footer group-focus:text-footer group-hover:scale-90 group-focus:scale-90 transition-transform focus:outline-none",
);

export function Footer() {
  const router = useRouter();

  const nav = new Array<{
    name: string;
    content: { name: string; href: string }[];
  }>();

  NavigationLinks.forEach((link) => {
    if (!link.content) {
      if (nav.findIndex((e) => e.name === "Temple Team") === -1) {
        nav.push({ name: "Temple Team", content: Array() });
      }
      nav[nav.findIndex((e) => e.name === "Temple Team")]?.content.push(link);
    } else {
      nav.push(link);
    }
  });

  return (
    <footer className="flex flex-col justify-center gap-8 bg-footer px-2 pb-4 pt-8 text-footer-foreground lg:grid lg:grid-flow-row lg:auto-rows-auto lg:grid-cols-3 lg:p-1050 lg:pb-6 lg:pt-10">
      <div className="flex w-full flex-col gap-8 lg:col-end-1 lg:grid">
        <div className="flex w-fit flex-col gap-4 self-center">
          <Image
            src="/img/footer.png"
            width={651}
            height={271}
            alt="Logo de la Temple Team"
            className="w-[300px] saturate-150"
          />
          <Typography variant="h3" className="text-center font-sans font-light">
            {" "}
            La Temple Team s'occupe de tout !
          </Typography>
        </div>
        <div className="flex justify-around">
          <a
            href="https://www.youtube.com/@TempleTeam"
            className={socialLinksClass()}
            aria-label="Youtube"
          >
            <Youtube strokeWidth={1.1} className={cn(socialLinksIconClass())} />
          </a>
          <a
            href="https://www.instagram.com/templeteam.off"
            className={socialLinksClass()}
            aria-label="Instagram"
          >
            <Instagram
              strokeWidth={1.1}
              className={cn(socialLinksIconClass(), "")}
            />
          </a>
          <a
            href="https://www.facebook.com/templeteam.off"
            className={socialLinksClass()}
            aria-label="Facebook"
          >
            <Facebook
              strokeWidth={1.1}
              className={cn(socialLinksIconClass(), "mr-[3px]")}
            />
          </a>
          <Link
            href="/contact"
            className={socialLinksClass()}
            aria-label="Contact"
          >
            <Mail
              strokeWidth={1.1}
              className={cn(socialLinksIconClass(), "")}
            />
          </Link>
        </div>
      </div>
      <nav className="h-full justify-self-center lg:col-start-1 lg:col-end-3">
        <Accordion type="single" collapsible className="lg:hidden">
          {nav.map((link, i) => (
            <AccordionItem
              key={"Footer Mobile:" + link.name + i}
              value={link.name}
              className="border-footer-separator"
            >
              <Typography
                variant="h3"
                className="font-caption font-semibold"
                as={AccordionTrigger}
              >
                {link.name}
              </Typography>
              <AccordionContent>
                <ul className="flex flex-col gap-2">
                  {link.content?.map((sublink, i) => (
                    <li
                      key={
                        "Footer Mobile content:" +
                        sublink.name +
                        sublink.href +
                        i
                      }
                    >
                      <Typography
                        variant="footerLink"
                        href={sublink.href}
                        as={Link}
                        className="group"
                      >
                        <span
                          className={cn(
                            "flex w-fit flex-col after:origin-left after:scale-x-0 after:border-b after:border-footer-foreground after:duration-300 group-hover:after:scale-x-100",
                          )}
                        >
                          {sublink.name}
                        </span>
                      </Typography>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <ul className="hidden gap-4 lg:flex">
          <li>
            <Separator
              orientation="vertical"
              className="bg-footer-separator lg:bg-footer-navSeparator"
            />
          </li>
          {nav.map((link, i) => (
            <>
              <li key={"Footer Desktop:" + link.name + i}>
                <Typography variant="h3" className="whitespace-nowrap">
                  {link.name}
                </Typography>
                <ul>
                  {link.content?.map((sublink, i) => (
                    <li
                      key={
                        "Footer Desktop content:" +
                        sublink.name +
                        sublink.href +
                        i
                      }
                    >
                      <Typography
                        variant="footerLink"
                        href={sublink.href}
                        as={Link}
                        className="group whitespace-nowrap"
                      >
                        <span
                          className={cn(
                            "flex w-fit flex-col text-lg after:origin-left after:scale-x-0 after:border-b after:border-footer-foreground after:duration-300 group-hover:after:scale-x-100",
                          )}
                        >
                          {sublink.name}
                        </span>
                      </Typography>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Separator
                  orientation="vertical"
                  className="bg-footer-separator lg:bg-footer-navSeparator"
                />
              </li>
            </>
          ))}
        </ul>
      </nav>
      <div className="flex justify-between gap-5 lg:flex-col lg:items-end lg:justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger className="group flex h-fit items-center gap-3 border-b border-footer-foreground pb-1 focus:outline-none">
            <Languages className="h-5 w-5" /> Langue
            <ChevronDownIcon
              className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => router.push("/")}>
              Français
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push("/")}>
              Anglais
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle className="hover:bg-transparent hover:text-footer-foreground" />
      </div>
      <Separator
        orientation="horizontal"
        className="bg-footer-separator lg:col-span-4"
      />
      <div className="w-full flex flex-col md:flex-row items-center gap-4 md:justify-between lg:col-span-4 -translate-y-3">
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <Typography
            variant="base"
            href="/legal/"
            as={Link}
            className="text-xs"
          >
            Mentions légales
          </Typography>
          <Separator className="w-3 bg-footer-separator" />
          <Typography
            variant="base"
            href="/legal/privacy"
            as={Link}
            className="text-xs"
          >
            Politique de confidentialité
          </Typography>
          <Separator className="w-3 bg-footer-separator" />
          <Typography
            variant="base"
            href="/legal"
            as={Link}
            className="text-xs"
          >
            Gestion des cookies
          </Typography>
        </div>
        <div className="flex w-fit items-center">
          <Typography variant="base" className="text-xs">
            &copy; {new Date().getFullYear()} Temple Team
          </Typography>
        </div>
      </div>
    </footer>
  );
}
