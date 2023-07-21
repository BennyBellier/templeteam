import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import type { Dispatch, SetStateAction, ReactNode } from "react";
import { useState, useEffect } from "react";
import { BiChevronDown } from "react-icons/bi";
import ThemeButton from "./theme";

interface HamburgerMenuProps {
  isActive: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
}

const MenuLink = ({
  href,
  subMenu,
  children,
}: {
  href: string;
  subMenu?: boolean;
  children: ReactNode;
}) => {
  const router = useRouter();

  return (
    <>
      <Link
        href={href}
        className={`${
          subMenu ? "text-2xl 1050:text-lg" : "text-3xl 1050:text-xl"
        } transition-color ease whitespace-nowrap font-extrabold duration-300 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-400 1050:font-normal ${
            router.pathname.includes(href)
            ? "1050:border-b-2 1050:border-neutral-800 dark:1050:border-neutral-100"
            : ""
        } `}
      >
        {children}
      </Link>
    </>
  );
};

const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
};

const HeaderLogo = () => {
  const size = useWindowSize();
  const [logo, setLogo] = useState("/logo-light.svg");

  // detect when html class get "dark" or not
  useEffect(() => {
    function handleThemeChange(theme: string) {
      if (theme === "light") {
        setLogo("/logo-light.svg");
      } else {
        setLogo("/logo-dark.svg");
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

  if (size.width >= 1050) {
    return (
      <Image src={logo} alt="Logo de la Temple Team" width={70} height={70} />
    );
  } else if (size.width < 1050 && size.width >= 768) {
    return (
      <Image src={logo} alt="Logo de la Temple Team" width={60} height={60} />
    );
  } else {
    return (
      <Image src={logo} alt="Logo de la Temple Team" width={50} height={50} />
    );
  }
};

const AssociationDropdownMenu = () => {
  const [open, setOpen] = useState(false);
  const size = useWindowSize();

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="peer group flex items-center justify-center gap-1 hover:text-neutral-500 dark:text-neutral-50"
      >
        <MenuLink href="/association">Association</MenuLink>
        <BiChevronDown
          className={`inline-block transition-transform duration-300 ease-in-out group-hover:rotate-180 ${
            open ? "rotate-180" : ""
          } hidden 1050:block`}
        />
      </button>
      <ul
        className={`${
          open || size.width < 1050 ? "flex" : "hidden"
        } peer-hover:flex flex-col gap-y-3 px-10 py-1 pt-4 hover:flex dark:bg-neutral-800 1050:absolute 1050:gap-1 1050:rounded-md 1050:bg-neutral-100 1050:px-4 1050:py-2 1050:shadow-neutral-900 1050:drop-shadow-xl`}
      >
        <li className="hidden 1050:inline-block">
          <MenuLink subMenu href="/association">
            Acceuil
          </MenuLink>
        </li>
        <li>
          <MenuLink subMenu href="/association/stage">
            Stage
          </MenuLink>
        </li>
        <li>
          <MenuLink subMenu href="/association/samedi_sportif">
            Samedi sportif
          </MenuLink>
        </li>
      </ul>
    </>
  );
};

const HamburgerMenu = ({ isActive, setActive }: HamburgerMenuProps) => {
  const handleToggle = () => {
    setActive(!isActive);
  };

  return (
    <button
      className={`hamburger hamburger--spin inline-block 1050:hidden ${
        isActive ? "is-active" : ""
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

export default function Navigation() {
  const [isActive, setActive] = useState(false);
  const size = useWindowSize();

  return (
    <nav className="fixed h-full w-full font-display 1050:left-0 1050:top-0 1050:flex 1050:h-min 1050:w-full 1050:justify-between 1050:bg-neutral-50 1050:py-2 dark:1050:bg-neutral-800">
      <div className="fixed flex h-[60px] w-full flex-row justify-between bg-neutral-50 dark:bg-neutral-800 md:h-[70px] 1050:static 1050:h-[80px] 1050:justify-normal 1050:bg-transparent">
        <Link
          href="/"
          className="flex items-center justify-center px-2 transition-transform duration-300 ease-out hover:scale-90 hover:ease-in"
        >
          <HeaderLogo />
        </Link>
        <HamburgerMenu isActive={isActive} setActive={setActive} />
      </div>
      <div
        className={`relative top-[60px] flex h-full flex-col gap-10 bg-neutral-50 dark:bg-neutral-800 md:top-[70px] 1050:h-min 1050:items-center ${
          isActive ? "translate-x-0" : "translate-x-full"
        } ease px-8 pt-5 transition-transform duration-1000 1050:static 1050:top-0 1050:translate-x-0 1050:flex-row 1050:gap-10`}
      >
        <ul className="flex w-full flex-col gap-x-2 gap-y-5 1050:flex-row 1050:gap-x-4">
          <li>
            <MenuLink href="/">Acceuil</MenuLink>
          </li>
          <li>
            <MenuLink href="/la-team">La Team</MenuLink>
          </li>
          <li>
            <MenuLink href="/medias">Médias</MenuLink>
          </li>
          <li>
            <MenuLink href="/blog">Blog</MenuLink>
          </li>
          <li>
            <MenuLink href="/references">Références</MenuLink>
          </li>
          <li>
            <MenuLink href="/contact">Contact</MenuLink>
          </li>
          <li>
            <AssociationDropdownMenu />
          </li>
        </ul>
        {size.width >= 1050 ? (
          <ThemeButton logoOnly={true} size={1.35} />
        ) : (
          <ThemeButton logoOnly={false} size={1.35} />
        )}
      </div>
    </nav>
  );
}
