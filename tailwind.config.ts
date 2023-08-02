import { type Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      display: ["Manrope", "Inter", "system-ui", "sans-serif"],
      body: ["Rubik", "Inter", "system-ui", "sans-serif"],
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
      },
      transformOrigin: {
        "top-center": "top center",
      },
      transitionProperty: {
        height: "height",
      },
    },
  },
  plugins: [
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
      });
    }),
  ],
} satisfies Config;
