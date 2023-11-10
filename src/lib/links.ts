export interface LinkProps {
  readonly type: string;
  readonly title: string;
  readonly href: string;
  readonly links?: LinkProps[];
}

export const links: LinkProps[] = [
  {
    type: "link",
    title: "Accueil",
    href: "/",
  },
  {
    type: "link",
    title: "La Team",
    href: "/la-team",
  },
  {
    type: "submenu",
    title: "Portfolio",
    href: "/portfolio",
    links: [
      {
        type: "link",
        title: "Photos",
        href: "/portfolio/photos",
      },
      {
        type: "link",
        title: "Vidéos",
        href: "/portfolio/videos",
      },
    ],
  },
  {
    type: "link",
    title: "Blog",
    href: "/blog",
  },
  {
    type: "link",
    title: "Références",
    href: "/references",
  },
  {
    type: "link",
    title: "Contact",
    href: "/contact",
  },
  {
    type: "submenu",
    title: "Association",
    href: "/association",
    links: [
      {
        type: "link",
        title: "Accueil",
        href: "/association",
      },
      {
        type: "link",
        title: "Stage",
        href: "/association/stage",
      },
      {
        type: "link",
        title: "Samedi sportif",
        href: "/association/samedi_sportif",
      },
    ],
  },
];