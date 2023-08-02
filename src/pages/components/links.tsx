import type { ReactNode } from "react";

export interface LinkProps {
  href: string;
  name: string;
}

export interface LinkGroupProps {
  name: string;
  root: string;
  links: LinkProps[];
}

export interface LangListProps {
  name: string;
  logo: ReactNode;
  href: string;
}

export const associationLinks: LinkProps[] = [
  {
    href: "/association",
    name: "Acceuil",
  },
  {
    href: "/association/stage",
    name: "Stage",
  },
  {
    href: "/association/samedi_sportif",
    name: "Samedi sportif",
  },
];

export const links: LinkProps[] = [
  {
    href: "/",
    name: "Acceuil",
  },
  {
    href: "/la-team",
    name: "La Team",
  },
  {
    href: "/medias",
    name: "Médias",
  },
  {
    href: "/blog",
    name: "Blog",
  },
  {
    href: "/references",
    name: "Références",
  },
  {
    href: "/contact",
    name: "Contact",
  },
];

export const allLinks: LinkProps[] = [...links, ...associationLinks];

export const groupedLinks: LinkGroupProps[] = [
  {
    name: "Temple Team",
    root: "/",
    links: links,
  },
  {
    name: "Association",
    root: "/association",
    links: associationLinks,
  },
];

export const lang: LangListProps[] = [
  {
    name: "Français",
    logo: "🇫🇷",
    href: "/",
  },
  {
    name: "English",
    logo: "🇬🇧",
    href: "/en",
  },
];