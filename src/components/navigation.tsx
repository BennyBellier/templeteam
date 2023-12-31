import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import type { Dispatch, SetStateAction, ReactNode } from "react";
import { useState, useEffect } from "react";
import {
  ThemeButtonTypes,
  ThemeButton,
  Expand,
  useWindowSize,
} from "./elements";
import { links } from "../lib/links";
import type { LinkProps } from "../lib/links";

interface HamburgerMenuProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const MenuLink = ({
  href,
  subMenu,
  children,
}: {
  href: string;
  subMenu?: boolean;
  children: ReactNode;
}) => {
  const router = useRouter();

  // test if the link is the same as the current page to add underline
  const testPath = (href: string) => {
    const pathSize = router.pathname.split("/").length;
    const hrefSize = href.split("/").length;
    if (pathSize === hrefSize) {
      for (let index = 1; index < pathSize; index++) {
        if (router.pathname.split("/")[index] !== href.split("/")[index]) {
          return false;
        }
      }
      return true;
    }
  };


  return (
    <>
      <Link
        href={href}
        className={`${
          subMenu ? "text-2xl 1050:text-lg" : "text-3xl 1050:text-xl"
        } transition-color ease w-min whitespace-nowrap duration-300 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-400 ${
          testPath(href) ? "1050:after:scale-x-100" : ""
        } after:ease after:transition-width flex flex-col after:w-full after:scale-x-0 after:transform after:border-b after:border-neutral-800 after:duration-300 after:content-[''] hover:after:scale-x-100 dark:after:border-neutral-100`}
      >
        {children}
      </Link>
    </>
  );
};

export const HeaderLogo = () => {
  const { width } = useWindowSize();
  const [logo, setLogo] = useState("/img/logo-light.png");

  // detect when html class get "dark" or not to change the logo
  useEffect(() => {
    function handleThemeChange(theme: string) {
      if (theme === "light") {
        setLogo("/img/logo-light.png");
      } else {
        setLogo("/img/logo-dark.png");
      }
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const htmlClasses = document.querySelector("html")?.classList;
          if (htmlClasses) {
            handleThemeChange(htmlClasses.contains("dark") ? "dark" : "light");
          }
        }
      });
    });

    observer.observe(document.querySelector("html") as Node, {
      attributes: true,
    });

    return () => {
      observer.disconnect();
    };
  });

  const size = width >= 1050 ? 70 : width >= 768 ? 60 : 50;

  return (
    <Image src={logo} alt="Logo de la Temple Team" width={size} height={size} className="w-auto h-auto"/>
  );
};

export const DropdownMenu = ({ group }: { group: LinkProps }) => {
  const [open, setOpen] = useState(false);
  const size = useWindowSize();

  // toggle the dropdown menu
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <li className="group" onClick={handleOpen}>
      <button className="flex items-center justify-center gap-1 hover:text-neutral-500 dark:text-neutral-50">
        <MenuLink href={group.href}>{group.name}</MenuLink>
        <Expand isOpen={open} className="hidden 1050:block" />
      </button>
      <ul
        className={`${
          open || size.width < 1050
            ? "opacity-100 rotate-x-0"
            : "opacity-0 -rotate-x-90"
        } flex origin-top-center flex-col gap-y-4 px-10 py-2 transition-transform delay-100 duration-300 ease-out group-hover:opacity-100 group-hover:rotate-x-0 dark:bg-neutral-850 1050:absolute 1050:gap-1 1050:rounded-lg 1050:bg-white 1050:px-4 1050:py-2 1050:shadow-neutral-900 1050:drop-shadow-xl dark:1050:bg-neutral-800 dark:1050:shadow-none`}
      >
        {group.links?.map((link: LinkProps) => // map all links of the dropdown menu

          group.href === link.href ? (
            <li key={link.name} className="hidden 1050:inline-block">
              <MenuLink href={link.href} subMenu>
                {link.name}
              </MenuLink>
            </li>
          ) : (
            <li key={link.name}>
              <MenuLink href={link.href} subMenu>
                {link.name}
              </MenuLink>
            </li>
          )
          )}
      </ul>
    </li>
  );
};

interface HamburgerMenuProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const HamburgerMenu = ({ isOpen, setOpen }: HamburgerMenuProps) => {
  // toggle the hamburger menu
  const handleToggle = () => {
    setOpen(!isOpen);
  };

  return (
    <button
      className={`hamburger hamburger--spin inline-block ${
        isOpen ? "is-active" : ""
      }`}
      type="button"
      onClick={handleToggle}
    >
      <span className="hamburger-box">
        <span className="hamburger-inner bg-neutral-800 before:bg-neutral-800 after:bg-neutral-800 dark:bg-neutral-50 dark:before:bg-neutral-50 dark:after:bg-neutral-50"></span>
      </span>
    </button>
  );
};

/**
   * @description
   * This component is the navigation bar of the website.
   * It is composed of 2 parts:
   * - The header, which contains the logo for both desktop and mobile and the hamburger menu for mobile
   * - The menu, which contains the links to the different pages of the website
   * The menu is composed of 2 elements:
   * - Simple links, displayed as a list
   * - Dropdown links, displayed as a list with a dropdown
   *
   * @usage
   * ```tsx
   * <Navigation />
   * ```
   *
   * @returns {JSX.Element} The navigation bar
   */
export default function Navigation() {
  const [isOpen, setOpen] = useState(false);
  const size = useWindowSize();
  const [y, setY] = useState(0);

  useEffect(() => {
    function handleNavigation() {
      setY(window.scrollY);
    }

    function handleScroll(e: WheelEvent | TouchEvent) {
      if (isOpen) {
        e.preventDefault();
      }
    }

    // event listener to change the shadow of the navbar when scrolling
    window.addEventListener("scroll", handleNavigation);

    // event listener for deactivate scroll when mobile menu is open
    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("touchmove", handleScroll, { passive: false });


    return () => {
      window.removeEventListener("scroll", handleNavigation);
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [isOpen]);

  return (
    <nav
      id="main-nav"
      className={`overflow-hidden-x fixed z-50 flex max-h-[60px] justify-between font-display font-bold transition-shadow md:max-h-[70px] 1050:left-0 1050:top-0 1050:h-min 1050:max-h-[80px] 1050:w-full 1050:items-center 1050:bg-white 1050:font-light 1050:px-1050 dark:1050:bg-neutral-850 duration-1000 ${
        y === 0
          ? ""
          : "shadow-md dark:drop-shadow-none"
      }'}`}
    >
      <div className="fixed flex h-[60px] w-full flex-row items-center justify-between bg-white px-5 dark:bg-neutral-850 md:h-[70px] 1050:static 1050:h-[80px] 1050:w-[80px] 1050:justify-normal 1050:bg-transparent 1050:px-0 1050:dark:bg-transparent">
        <Link
          href="/"
          className="flex w-fit items-center justify-center transition-transform duration-300 ease-out hover:scale-90 hover:ease-in"
        >
          <HeaderLogo />
        </Link>
        {size.width < 1050 ? (<HamburgerMenu isOpen={isOpen} setOpen={setOpen} />) : (<></>)}
      </div>
      <div
        className={`relative top-[60px] flex h-screen w-screen flex-col gap-10 bg-white dark:bg-neutral-850 md:top-[70px] 1050:h-min 1050:items-center ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ease px-8 pt-5 transition-transform duration-1000 1050:static 1050:top-0 1050:w-fit 1050:translate-x-0 1050:flex-row 1050:gap-10 1050:px-0 1050:pt-0`}
      >
        <ul className="flex w-full flex-col gap-x-2 gap-y-5 1050:flex-row 1050:gap-x-6">
          {links.map((link) => // map all links
            link.type === "link" ? (
              <li key={link.name}>
                <MenuLink href={link.href}>{link.name}</MenuLink>
              </li>
            ) : (
              <DropdownMenu key={link.name} group={link} />
            )
          )}
        </ul>
        {size.width >= 1050 ? (
          <ThemeButton type={ThemeButtonTypes.DesktopNav} size={1.35} />
        ) : (
          <ThemeButton type={ThemeButtonTypes.MobileNav} size={1.6} />
        )}
      </div>
    </nav>
  );
}
