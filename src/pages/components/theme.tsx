import { useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

interface ThemeButtonProps {
  logoOnly?: boolean;
  size?: number;
}

interface ThemeLogoProps {
  theme: string;
  size?: number;
}

const ThemeLogo = ({ theme, size }: ThemeLogoProps) => {
  if (theme === "light") {
    return (
      <FiMoon
        size={size+'rem'}
        className={`hover:text-neutral-500 ease duration-300`}
      />
    );
  }
  return (
    <FiSun
      size={size+'rem'}
      className={`ease duration-300 hover:text-neutral-500`}
    />
  );
};

const ThemeButton = ({ logoOnly, size }: ThemeButtonProps) => {
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

  if (logoOnly) {
    return (
      <button
        className="text-neutral-800 hover:text-neutral-500 dark:text-neutral-50"
        onClick={toggleTheme}
      >
        <ThemeLogo theme={theme} size={size} />
      </button>
    );
  }

  return (
    <button
      className=" ease w-${width} h-${height} flex w-full items-center justify-between rounded-md bg-neutral-800 px-10 py-4 text-3xl font-bold text-neutral-50 shadow-md shadow-neutral-800/25 duration-300 hover:scale-90 hover:bg-red-550 dark:bg-neutral-50 dark:text-neutral-800 dark:shadow-neutral-50/25 dark:hover:bg-red-450 md:px-20"
      onClick={toggleTheme}
    >
      Thème {theme === "light" ? "sombre" : "clair"}{" "}
      <ThemeLogo theme={theme} size={size} />
    </button>
  );
};

export default ThemeButton;
