import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { HiChevronDown, HiMoon, HiSun } from "react-icons/hi2";
import { motion } from "framer-motion";

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

/**
 * @description
 * A logo with a moon and a sun depending on the theme
 *
 * @param props.theme the current theme
 * @param props.size the size of the logo
 *
 * @returns {JSX.Element} a logo with a moon and a sun depending on the theme
 */
const ThemeLogo = ({ theme, size, className }: ThemeLogoProps) => {
  return (
    // <AnimatePresence>
    (theme === "light" && (
      <motion.div
        data-testid="moon-theme"
        className="grid h-6 w-6 grid-cols-1 grid-rows-1 overflow-hidden"
      >
        <HiMoon
          data-testid="moon"
          size={size + "rem"}
          className={`${className} transform-gpu transition-transform`}
        />
      </motion.div>
    )) || (
      <motion.div
        data-testid="sun-theme"
        className="grid h-6 w-6 grid-cols-1 grid-rows-1 overflow-hidden"
      >
        <HiSun
          data-testid="sun"
          size={size + "rem"}
          className={`${className} transform-gpu transition-transform`}
        />
      </motion.div>
    )
    // </AnimatePresence>
  );
};

/**
 * @description
 * A button to toggle the theme
 *
 * @param props.type the type of the button : `ThemeButtonTypes.MobileNav`, `ThemeButtonTypes.DesktopNav` or `ThemeButtonTypes.Footer`
 * @param props.size the size of the logo
 * @param props.className the class name of the button
 *
 * @returns {JSX.Element} a button to toggle the theme
 */
export const ThemeButton = ({ type, size, className }: ThemeButtonProps) => {
  const [theme, setTheme] = useState("light");
  const [text, setText] = useState("Thème sombre");

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    function handleThemeChange(theme: string) {
      if (theme === "light") {
        setText("Thème sombre");
        setTheme("light");
      } else {
        setText("Thème clair");
        setTheme("dark");
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

  switch (type) {
    case ThemeButtonTypes.MobileNav:
      return (
        <button
          className={
            "ease w-${width} h-${height} group flex w-full items-center justify-between rounded-md bg-neutral-800 px-8 py-4 text-2xl font-bold text-neutral-50 shadow-md shadow-neutral-800/25 duration-300 hover:scale-90 hover:bg-red-550 dark:bg-neutral-50 dark:text-neutral-800 dark:shadow-neutral-50/25 dark:hover:bg-red-450 md:px-20 " +
            className
          }
          onClick={toggleTheme}
        >
          {text}
          <ThemeLogo
            theme={theme}
            size={size}
            className="text-neutral-50 dark:text-neutral-800"
          />
        </button>
      );

    case ThemeButtonTypes.DesktopNav:
      return (
        <button className={"group " + className} onClick={toggleTheme}>
          <ThemeLogo
            theme={theme}
            size={size}
            className={"fill-neutral-800 dark:fill-neutral-50"}
          />
        </button>
      );

    case ThemeButtonTypes.Footer:
      return (
        <button className={"group " + className} onClick={toggleTheme}>
          <ThemeLogo theme={theme} size={size} className="fill-neutral-50" />
        </button>
      );
  }
};

/**
 * @description
 * A globe icon for language dropdown
 *
 * @param param.className the class name of the icon
 * @returns {JSX.Element} a globe icon for language dropdown
 */
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

/**
 * @description
 * A reusable chevron icon for dropdown
 *
 * @param param.isOpen pass the variable of dropdown state open or not
 * @param param.className the class name of the icon
 *
 * @returns {JSX.Element} a chevron icon for dropdown
 */
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

/**
 * @description
 * A dropdown for language selection
 *
 * @returns {JSX.Element} a dropdown for language selection
 */
export const LangDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

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
          <Link
            href={router.pathname.replace("en/", "")}
            className="ease duration-100 hover:text-neutral-500"
          >
            Français
          </Link>
        </li>
        <li>
          <Link
            href={"en" + router.pathname}
            className="ease duration-100 hover:text-neutral-500"
          >
            English
          </Link>
        </li>
      </ul>
    </div>
  );
};

/**
 * @description
 * A hook to get the window size
 *
 * @returns [width, height] the window size
 */
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
