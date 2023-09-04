export interface LinkProps {
  readonly type: string;
  readonly name: string;
  readonly href: string;
  readonly links?: LinkProps[];
}

export const links: LinkProps[] = [
  {
    type: "link",
    name: "Acceuil",
    href: "/",
  },
  {
    type: "link",
    name: "La Team",
    href: "/la-team",
  },
  {
    type: "dropdown",
    name: "Portfolio",
    href: "/portfolio",
    links: [
      {
        type: "link",
        name: "Photos",
        href: "/portfolio/photos",
      },
      {
        type: "link",
        name: "Vidéos",
        href: "/portfolio/videos",
      },
    ],
  },
  {
    type: "link",
    name: "Blog",
    href: "/blog",
  },
  {
    type: "link",
    name: "Références",
    href: "/references",
  },
  {
    type: "link",
    name: "Contact",
    href: "/contact",
  },
  {
    type: "dropdown",
    name: "Association",
    href: "/association",
    links: [
      {
        type: "link",
        name: "Acceuil",
        href: "/association",
      },
      {
        type: "link",
        name: "Stage",
        href: "/association/stage",
      },
      {
        type: "link",
        name: "Samedi sportif",
        href: "/association/samedi_sportif",
      },
    ],
  },
];