import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HiChevronDown, HiMoon, HiSun } from "react-icons/hi2";

export enum ThemeButtonTypes {
  MobileNav,
  DesktopNav,
  Footer,
}

interface ThemeButtonProps {
  type: ThemeButtonTypes;
  size?: number;
  className?: string;
}

interface ThemeLogoProps {
  theme: string;
  size?: number;
  className?: string;
}

const ThemeLogo = ({ theme, size, className }: ThemeLogoProps) => {
  if (theme === "light") {
    return (
      <HiMoon
        size={size + "rem"}
        className={`ease duration-300 group-hover:fill-neutral-50 ${className}`}
      />
    );
  }
  return (
    <HiSun
      size={size + "rem"}
      className={`ease duration-300 group-hover:fill-neutral-800 ${className}`}
    />
  );
};

export const ThemeButton = ({ type, size, className }: ThemeButtonProps) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  };

  switch (type) {
    case ThemeButtonTypes.MobileNav:
      return (
        <button
          className={
            "ease w-${width} h-${height} group flex w-full items-center justify-between rounded-md bg-neutral-800 px-8 py-4 text-3xl font-bold text-neutral-50 shadow-md shadow-neutral-800/25 duration-300 hover:scale-90 hover:bg-red-550 dark:bg-neutral-50 dark:text-neutral-800 dark:shadow-neutral-50/25 dark:hover:bg-red-450 md:px-20 " + className
          }
          onClick={toggleTheme}
        >
          Thème {theme === "light" ? "sombre" : "clair"}{" "}
          <ThemeLogo
            theme={theme}
            size={size}
            className="text-neutral-50 dark:text-neutral-800"
          />
        </button>
      );

    case ThemeButtonTypes.DesktopNav:
      return (
        <button
          className={"fill-neutral-800 dark:fill-neutral-50 " + className}
          onClick={toggleTheme}
        >
          <ThemeLogo
            theme={theme}
            size={size}
            className="fill-neutral-800 dark:fill-neutral-50"
          />
        </button>
      );

    case ThemeButtonTypes.Footer:
      return (
        <button className={"dark:fill-neutral-50 " + className} onClick={toggleTheme}>
          <ThemeLogo theme={theme} size={size} className="fill-neutral-50" />
        </button>
      );
  }
};

const HiGlobeAlt = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={"h-6 w-6" + className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  );
};

export const Expand = ({
  isOpen,
  className,
}: {
  isOpen: boolean;
  className?: string;
}) => {
  return (
    <HiChevronDown
      className={`block transition-transform duration-300 ease-in-out group-hover:rotate-180 ${
        isOpen ? "rotate-180" : ""
      } ${className ?? ""}`}
    />
  );
};

export const LangDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOpen = () => {
    setIsOpen(!isOpen);
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
    <div className="group flex w-fit flex-col justify-center ">
      <button
        ref={dropdownRef}
        onClick={handleOpen}
        className="flex w-full items-center justify-between gap-2 border-b border-b-neutral-50/40 text-sm"
      >
        <HiGlobeAlt className="h-4 w-4" />
        Langue
        <Expand isOpen={isOpen} />
      </button>
      <ul
        className={`text-md absolute flex origin-top translate-y-[80%] flex-col gap-2 rounded-md border-b border-neutral-50/50 bg-neutral-50 px-7 py-1 font-light text-neutral-800 delay-100 duration-300 ease-out group-hover:opacity-100 group-hover:rotate-x-0
        ${isOpen ? "opacity-100 rotate-x-0" : "opacity-0 rotate-x-90"}`}
      >
        <li>
          <Link href="/" className="hover:text-neutral-300">
            Français
          </Link>
        </li>
        <li>
          <Link href="/en" className="hover:text-neutral-300">
            English
          </Link>
        </li>
      </ul>
    </div>
  );
};

export const useWindowSize = () => {
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
