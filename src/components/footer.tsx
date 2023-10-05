import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import CookieManager from "./cookieManager";
import Image from "next/image";
import { HiEnvelope } from "react-icons/hi2";
import { FaInstagram, FaYoutube, FaFacebookF } from "react-icons/fa";
import type { ReactNode } from "react";
import {
  Expand,
  LangDropdown,
  ThemeButton,
  ThemeButtonTypes,
  useWindowSize,
} from "./elements";
import type { LinkProps } from "../lib/links";
import { links } from "../lib/links";
import { motion } from "framer-motion";

const SmallPrintList = () => {
  return (
    <ul className="flex w-full flex-col items-center gap-2 1050:flex-row [&>li:not(:last-child)]:flex [&>li:not(:last-child)]:flex-col [&>li:not(:last-child)]:items-center [&>li:not(:last-child)]:gap-2 [&>li:not(:last-child)]:after:h-[1px] [&>li:not(:last-child)]:after:w-2 [&>li:not(:last-child)]:after:bg-neutral-50 [&>li:not(:last-child)]:after:content-[''] 1050:[&>li:not(:last-child)]:flex-row">
      <li>
        <Link href="/mentions-legal">Mentions Légales</Link>
      </li>
      <li>
        <Link href="/confidentialite">Politique de confidentialité</Link>
      </li>
      <li>
        <CookieManager />
      </li>
    </ul>
  );
};

const SmallPrint = () => {
  return (
    <>
      <SmallPrintList />
      <span className="w-full text-center 1050:text-end">
        Copyright © 2023. Tous droit réservés <strong>Temple Team</strong>
      </span>
    </>
  );
};

const BrandAndLogo = () => {
  return (
    <>
      <Image src="/img/footer.png" alt="logo" width={325} height={135} />
      <span className="text-lg font-medium">
        {`La Temple Team s'occupe de tout`}
      </span>
    </>
  );
};

const SocialNetwork = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => {
  return (
    <li className="group h-min w-min">
      <a
        href={href}
        className="flex rounded-full border border-neutral-50 bg-transparent p-3 group-hover:bg-neutral-50"
      >
        {children}
      </a>
    </li>
  );
};

const SocialNetworks = () => {
  return (
    <>
      <ul className="flex w-full justify-between">
        <SocialNetwork href="http://youtube.com/@TempleTeam">
          <FaYoutube className="ease text-2xl duration-500 group-hover:scale-90 group-hover:fill-neutral-800" />
        </SocialNetwork>
        <SocialNetwork href="http://instagram.com/templeteam.off">
          <FaInstagram className="ease text-2xl duration-500 group-hover:scale-90 group-hover:fill-neutral-800" />
        </SocialNetwork>
        <SocialNetwork href="http://facebook.com/templeteam.off">
          <FaFacebookF className="ease text-2xl duration-500 group-hover:scale-90 group-hover:fill-neutral-800" />
        </SocialNetwork>
        <SocialNetwork href="mailto:contact@templeteam.fr">
          <HiEnvelope className="ease text-2xl duration-500 group-hover:scale-90 group-hover:fill-neutral-800" />
        </SocialNetwork>
      </ul>
    </>
  );
};

const Dropdown = ({
  name,
  links,
}: {
  name: string;
  links: LinkProps[] | undefined;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const size = useWindowSize();

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const dropdownSize = () => {
    if (links) return links.length * 2.25 + 0.5;
    return 0;
  };

  useEffect(() => {
    function handleClickOutside() {
      if (dropdownRef.current) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full flex-col justify-center 1050:justify-start 1050:border-r 1050:border-red-550 1050:pr-5 1050:first:border-l 1050:first:pl-5">
      <button
        ref={dropdownRef}
        onClick={handleOpen}
        className="flex w-full items-center justify-between text-xl 1050:cursor-default 1050:whitespace-nowrap 1050:text-base"
      >
        {name}
        <Expand isOpen={isOpen} className="1050:hidden" />
      </button>
      <ul
        className={`flex origin-top flex-col gap-2 overflow-y-hidden border-b border-neutral-50/50 pt-2 transition-height duration-1000 1050:h-fit 1050:whitespace-nowrap 1050:border-b-0`}
        style={{
          height: `${
            size.width >= 1050
              ? "fit-content"
              : isOpen
              ? dropdownSize() + "rem"
              : 0 + "rem"
          }`,
        }}
      >
        {links?.map((link: LinkProps) => (
          <li
            key={link.name}
            className="ease group text-lg font-light duration-200 hover:text-neutral-500 1050:w-full 1050:text-sm"
          >
            <Link
              href={link.href}
              className="after:ease after:transition-width after:ease flex w-fit flex-col after:origin-left after:scale-x-0 after:border-b after:border-neutral-500 after:duration-300 after:content-[''] group-hover:after:scale-x-100"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * @description
 * The navigation for footer with dropdown menus on mobile.
 * The navigation is responsive and adapts to the screen size.
 * The navigation is also responsive to the user's theme.
 *
 * @returns {JSX.Element} The navigation for footer
 */
const Navigation = () => {
  const templeTeamLinks: LinkProps[] = [];
  const othersLinks: LinkProps[] = [];
  links.map((link) => {
    // map all links
    if (link.type === "link" || link.href === "/portfolio") {
      templeTeamLinks.push(link);
    } else {
      othersLinks.push(link);
    }
  });

  return (
    <nav className="flex w-full flex-col gap-5 1050:h-fit 1050:w-fit 1050:flex-row">
      <Dropdown name="Temple Team" links={templeTeamLinks} />
      {othersLinks.map((link) => (
        <Dropdown key={link.name} name={link.name} links={link.links} />
      ))}
    </nav>
  );
};

/**
 * @description
 * The footer of the website with social networks and decorations.
 * Navigation is also included, language dropdown and theme button.
 * Small print is also included with legal mentions, privacy policy and cookie manager.
 *
 * @usage
 * ```tsx
 * <Footer />
 * ```
 *
 *  @returns {JSX.Element} The footer
 */
export default function Footer() {
  return (
    <footer className="grid-row-4 relative bottom-0 top-[60px] grid w-full grid-cols-1 flex-wrap gap-5 overflow-y-hidden bg-neutral-800 px-5 pt-16 text-xs text-neutral-50 md:top-[70px] 1050:top-[80px] 1050:auto-cols-fr 1050:auto-rows-min 1050:px-1050">
      <div className="flex w-full flex-col items-center justify-center gap-3 1050:w-fit">
        <BrandAndLogo />
        <SocialNetworks />
      </div>
      <div className="w-full 1050:flex 1050:justify-center">
        <Navigation />
      </div>
      <div className="flex w-full justify-between 1050:flex-col 1050:items-end 1050:justify-around">
        <LangDropdown />
        <ThemeButton
          type={ThemeButtonTypes.Footer}
          size={1.3}
          className="1050:mr-9"
        />
      </div>
      <div className="flex w-full flex-wrap items-center justify-between gap-5 border-t border-neutral-50/50 pb-2 pt-5 font-light 1050:col-span-3 1050:h-fit 1050:flex-nowrap">
        <SmallPrint />
      </div>
    </footer>
  );
}
