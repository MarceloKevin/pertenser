import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        content: "1280px",
      },
      colors: {
        // Neutros — leve tom quente, nunca cinza puro
        paper: "#FFFFFF",
        mist: "#FAF8F9",
        cloud: "#F2EEF0",
        stone: {
          DEFAULT: "#8B8590",
          light: "#B4AEB7",
          dark: "#4A4550",
        },
        ink: "#2B2730",
        // Rosa — família principal da marca
        blush: {
          50: "#FDF6F8",
          100: "#F9E9EE",
          200: "#F3D6E0",
          300: "#EABED0",
          400: "#DE9CB6",
          500: "#CC7699",
          600: "#B5567F", // CTA principal
          700: "#93446A",
        },
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.75rem",
        blob: "40% 60% 60% 40% / 40% 40% 60% 60%",
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(43, 39, 48, 0.12)",
        card: "0 4px 24px -8px rgba(43, 39, 48, 0.10)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(181, 86, 127, 0.45)" },
          "70%": { boxShadow: "0 0 0 14px rgba(181, 86, 127, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(181, 86, 127, 0)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulseRing: "pulseRing 2.4s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
