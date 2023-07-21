import { type Config } from "tailwindcss";

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
      colors: {
        red: {
          450: "#f25c69",
          550: "#f24150",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
