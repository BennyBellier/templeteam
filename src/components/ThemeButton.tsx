import React, { useEffect, useState } from "react";
import { HiMoon, HiSun } from "react-icons/hi2";
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
