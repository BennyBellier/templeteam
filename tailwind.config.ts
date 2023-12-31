import { type Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  important: true,
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    fontFamily: {
      display: ['"Manrope"', "Inter", "sans-serif"],
      body: ['"Rubik"', "Inter", "sans-serif"],
    },
    extend: {
      screens: {
        "1050": "1050px",
      },
      display: ["group-hover"],
      colors: {
        red: {
          450: "#f25c69",
          550: "#f24150",
        },
        neutral: {
          850: "rgb(30,30,30)",
        },
      },
      transformOrigin: {
        "top-center": "top center",
      },
      transitionProperty: {
        height: "height",
      },
      dropShadow: {
        contact: "0.25rem 2px 3px rgb(38 38 38 / var(--tw-border-opacity))",
      },
    },
  },
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    // eslint-disable-next-line @typescript-eslint/ban-types
    plugin(({ addUtilities }: { addUtilities: Function }) => {
      addUtilities({
        ".rotate-x-0": {
          transform:
            "translate(var(--tw-translate-x), var(--tw-translate-y)) rotateX(0) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))",
        },
        ".rotate-x-90": {
          transform:
            "translate(var(--tw-translate-x), var(--tw-translate-y)) rotateX(90deg) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))",
        },
        ".rotate-x-180": {
          transform:
            "translate(var(--tw-translate-x), var(--tw-translate-y)) rotateX(180deg) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))",
        },
        ".-rotate-x-90": {
          transform:
            "translate(var(--tw-translate-x), var(--tw-translate-y)) rotateX(-90deg) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))",
        },
        ".px-1050": {
          paddingLeft: "calc((100vw - 1050px) / 2)",
          paddingRight: "calc((100vw - 1050px) / 2)",
        },
      });
    }),
  ],
} satisfies Config;
