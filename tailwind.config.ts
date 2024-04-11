import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: {
          dark: "#1F3BAD",
          darker: "#2547D0",
          base: "#335CFF",
          16: "#E1E7FF",
          10: "#EDF1FF",
        },
        bg: {
          950: "#0E121B",
          800: "#222530",
          300: "#CACFD8",
          200: "#E1E4E9",
          50: "#F5F7FA",
          0: "#FFFFFF",
        },
        text: {
          950: "#0E121B",
          600: "#525866",
          400: "#99A0AD",
          300: "#CACFD8",
          0: "#FFFFFF",
        },
        border: {
          950: "#0E121B",
          300: "#CACFD8",
          200: "#E1E4E9",
          0: "#FFFFFF",
        },
        error: {
          dark: "#681219",
          darker: "#D02533",
          base: "#FB3748",
          16: "#FFC0C5",
          10: "#FFEBEC",
        },
      },
    },
    borderRadius: {
      0: "0",
      4: "0.25rem",
      6: "0.375rem",
      8: "0.5rem",
      10: "0.625rem",
      12: "0.75rem",
      16: "1rem",
      20: "1.25rem",
      24: "1.5rem",
      full: "9999px",
    },
    boxShadow: {
      none: "none",
      xs: "0px 1px 2px 0px #0A0D1408",
      md: "0px 16px 32px -12px #0E121B1A",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
