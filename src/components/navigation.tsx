import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useState, useEffect, forwardRef, useRef } from "react";
import { ThemeButtonTypes, ThemeButton, useWindowSize } from "./elements";
import { links } from "../lib/links";
import type { LinkProps } from "../lib/links";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import { list } from "postcss";

interface HamburgerMenuProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

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

  if (width >= 1050)
    return (
      <Image src={logo} alt="Logo de la Temple Team" width={70} height={70} />
    );
  else if (width >= 768)
    return (
      <Image src={logo} alt="Logo de la Temple Team" width={60} height={60} />
    );
  else
    return (
      <Image src={logo} alt="Logo de la Temple Team" width={50} height={50} />
    );
};

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

const ListItem = forwardRef<
  HTMLAnchorElement,
  { title: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ title, ...props }, forwardedRef) => {
  const router = useRouter();
  const isActive = router.asPath === props.href;

  return (
    <li>
      <NavigationMenu.Link active={isActive} asChild>
        <Link
          href={props.href!}
          passHref
          className={clsx(
            "colorText whitespace-nowrap text-2xl 1050:text-lg",
            "block select-none p-3 outline-none",
            "focus:shadow-border-black dark:focus:shadow-border-white",
            "after:ease after:transition-width after:w-full after:scale-x-0",
            "after:transform after:border-b after:border-neutral-800",
            "after:duration-300 hover:after:scale-x-50 dark:after:border-neutral-100",
            "aria-[current=page]:after:scale-x-100"
          )}
          {...props}
          ref={forwardedRef}
        >
          {title}
        </Link>
      </NavigationMenu.Link>
    </li>
  );
});

ListItem.displayName = "ListItem";

const SubMenu = ({ link, setOffset }: { link: LinkProps, setOffset: Dispatch<SetStateAction<number>> }) => {
  return (
    <NavigationMenu.Item>
      <NavigationMenu.Trigger
        className={clsx(
          "group flex flex-row items-center gap-1 rounded-sm px-2 py-1 text-lg",
          "colorText select-none outline-none",
          "hover:text-neutral-500 dark:hover:text-neutral-400",
          "focus:shadow-border-black dark:focus:shadow-border-white"
        )}
        ref={(node) => {
          if (node?.getAttribute("data-state") === "open") {
            setOffset(node.offsetLeft);
          }
        }}
      >
        {link.title}{" "}
        <CaretDownIcon
          aria-hidden
          className={clsx(
            "colorText relative top-[1px] hidden 1050:block",
            "ease transition-transform duration-[250ms] ease-[ease]",
            "group-radix-state-open:rotate-180"
          )}
        />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content
        className={clsx(
          "relative  w-full rounded-lg",
          "radix-motion-from-start:animate-enter-from-left",
          "radix-motion-from-end:animate-enter-from-right",
          "radix-motion-to-start:animate-exit-to-left",
          "radix-motion-to-end:animate-exit-to-right"
        )}
      >
        <ul>
          {link.links?.map((sublink) => (
            <ListItem
              key={sublink.title + "-" + sublink.href}
              title={sublink.title}
              href={sublink.href}
            />
          ))}
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
};

const NavigationMenuListContent = (
  {getOffset}: { getOffset: Dispatch<SetStateAction<number>>}
) => {
  const { width } = useWindowSize();
  const router = useRouter();
  const [offSet, setOffset] = useState(0);

  useEffect(() => {
    getOffset(offSet);
  });

  if (width >= 1050) {
    return links.map((link) =>
      link.type === "link" ? (
        <NavigationMenu.Item key={link.title + "-" + link.href}>
          <NavigationMenu.Link
            active={router.asPath === link.href}
            className={clsx(
              "flex select-none flex-col items-center rounded-sm px-2 py-1",
              "colorText text-lg",
              "outline-none focus:shadow-border-black dark:focus:shadow-border-white",
              "after:ease after:transition-width after:w-full after:scale-x-0",
              "after:transform after:border-b after:border-neutral-800",
              "after:duration-300 hover:after:scale-x-50 dark:after:border-neutral-100",
              "aria-[current=page]:after:scale-x-100"
            )}
            href={link.href}
          >
            {link.title}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      ) : (
        <SubMenu
          key={link.title + "-" + link.href}
          link={link}
          setOffset={setOffset}
        />
      )
    );
  } else {
    return links.map((link) => (
      <>
        <NavigationMenu.Item key={link.title + "-" + link.href}>
          <NavigationMenu.Link
            active
            className="colorText flex select-none flex-row items-center gap-1 rounded-sm px-1 py-2 text-2xl outline-none focus:shadow-border-black dark:focus:shadow-border-white"
            href={link.href}
          >
            {link.title}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        {link.type === "submenu"
          ? link.links?.map((sublink) => (
              <NavigationMenu.Item key={sublink.title + "-" + sublink.href}>
                <NavigationMenu.Link
                  className="colorText mx-5 flex select-none flex-row items-center gap-1 rounded-sm px-1 py-2 text-2xl outline-none focus:shadow-border-black dark:focus:shadow-border-white"
                  href={sublink.href}
                >
                  {sublink.title}
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))
          : null}
      </>
    ));
  }
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
  const [triggerOffset, setTriggerOffset] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const viewportContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleNavigation() {
      setY(window.scrollY);
    }

    function handleScroll(e: WheelEvent | TouchEvent) {
      if (isOpen) {
        e.preventDefault();
      }
    }

    console.log(triggerOffset);

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
  }, [isOpen, triggerOffset]);

  return (
    <div
      id="main-nav"
      className={`navBarMaxHeight bg-primary fixed top-0 z-50 flex h-full w-full items-center justify-between px-2 font-display transition-shadow duration-500 1050:px-1050 ${
        y === 0 ? "" : "shadow-md dark:drop-shadow-none"
      }`}
    >
      <Link
        href="/"
        className="relative h-fit w-fit transition-transform duration-300 ease-out hover:scale-90 hover:ease-in"
      >
        <HeaderLogo />
      </Link>

      <NavigationMenu.Root
        className={clsx(
          "absolute left-0 top-[60px] h-screen w-screen px-8 pt-5 md:top-[70px]",
          `${isOpen ? "translate-x-0" : "translate-x-full"}`,
          "bg-primary transition-transform duration-1000",
          "1050:relative 1050:top-0 1050:h-fit 1050:w-fit 1050:transform-none 1050:px-0 1050:pt-0"
        )}
        orientation={size.width >= 1050 ? "horizontal" : "vertical"}
      >
        <NavigationMenu.List
        ref={listRef}
          className={clsx(
            "flex h-full w-full flex-col items-start font-bold",
            "1050:flex-row 1050:items-center 1050:justify-center 1050:font-light"
          )}
        >
          <NavigationMenuListContent getOffset={setTriggerOffset} />

          {/* Theme button */}
          <NavigationMenu.Item
            className={clsx(
              "flex w-full items-center pl-5 1050:w-fit",
              "focus:shadow-border-black dark:focus:shadow-border-white"
            )}
          >
            {size.width >= 1050 ? (
              <ThemeButton type={ThemeButtonTypes.DesktopNav} size={1.35} />
            ) : (
              <ThemeButton type={ThemeButtonTypes.MobileNav} size={1.6} />
            )}
          </NavigationMenu.Item>

          <NavigationMenu.Indicator
            className={clsx(
              "z-10 drop-shadow-2xl",
              "top-[100%] flex h-2 items-end justify-center overflow-hidden",
              "radix-state-visible:animate-fade-in",
              "radix-state-hidden:animate-fade-out",
              "transition-[width_transform] duration-[250ms] ease-[ease]"
            )}
          >
            <div className="bg-tertiary relative top-1 h-2 w-2 rotate-45 shadow-2xl" />
          </NavigationMenu.Indicator>
        </NavigationMenu.List>

        <div
          className={clsx(
            "absolute flex justify-center",
            "left-[-20%] top-[100%] w-[140%]"
          )}
          style={{
            perspective: "2000px",
          }}
          ref={viewportContainerRef}
        >
          <NavigationMenu.Viewport
            className={clsx(
              "bg-tertiary relative mt-2 overflow-hidden rounded-md shadow-2xl",
              "radix-state-open:animate-scale-in-content",
              "radix-state-closed:animate-scale-out-content",
              "origin-[top_center] transition-[width_height] duration-300 ease-[ease]",
              "radix"
            )}
            // style={{ width: "var(--radix-navigation-menu-viewport-width)" }}
            ref={(node) => {
              node?.style.setProperty(
                "translate",
                `${
                  triggerOffset - ((viewportContainerRef.current?.offsetWidth ?? 0) / 2)
                }px`
              );
            }}
          />
        </div>
      </NavigationMenu.Root>

      {size.width < 1050 ? (
        <HamburgerMenu isOpen={isOpen} setOpen={setOpen} />
      ) : null}
    </div>
  );
}