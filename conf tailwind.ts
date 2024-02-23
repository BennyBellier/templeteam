import { type Config } from "tailwindcss/types";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
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
      boxShadow: {
        "border-white": "0 0 0 1px rgb(250 250 250)",
        "border-black": "0 0 0 1px rgb(30 30 30)",
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
      keyframes: {
        "enter-from-right": {
          "0%": { transform: "translateX(200px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "enter-from-left": {
          "0%": { transform: "translateX(-200px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "exit-to-right": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(200px)", opacity: "0" },
        },
        "exit-to-left": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-200px)", opacity: "0" },
        },
        "scale-in-content": {
          "0%": { transform: "rotateX(-30deg) scale(0.9)", opacity: "0" },
          "100%": { transform: "rotateX(0deg) scale(1)", opacity: "1" },
        },
        "scale-out-content": {
          "0%": { transform: "rotateX(0deg) scale(1)", opacity: "1" },
          "100%": { transform: "rotateX(-10deg) scale(0.95)", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "enter-from-right": "enter-from-right 0.25s ease",
        "enter-from-left": "enter-from-left 0.25s ease",
        "exit-to-right": "exit-to-right 0.25s ease",
        "exit-to-left": "exit-to-left 0.25s ease",
        "scale-in-content": "scale-in-content 0.2s ease",
        "scale-out-content": "scale-out-content 0.2s ease",
        "fade-in": "fade-in 0.2s ease",
        "fade-out": "fade-out 0.2s ease",
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
          padding: "0 calc((100vw - 1050px) / 2)",
        },
      });
    }),
  ],
} satisfies Config;
