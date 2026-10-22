import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  // The storefront is light-only; dark: variants (from src/components/ui) apply only under a .dark class.
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // shadcn-style semantic tokens (values live in globals.css) for src/components/ui
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        brand: {
          50: "#eef4ff",
          100: "#dbe6ff",
          200: "#bfd3ff",
          300: "#93b4ff",
          400: "#608bff",
          500: "#3b66f5",
          600: "#2549ea",
          700: "#1d38d7",
          800: "#1e30ae",
          900: "#1e2f89",
          950: "#16205a",
        },
        gold: {
          300: "#f0cf7a",
          400: "#e3b341",
          500: "#c99a2e",
          600: "#a77c1f",
        },
        // Storefront + admin. Text pairings (WCAG AA): ink and ink-soft on canvas/paper/well;
        // ink-mute only for placeholders and icons; white on ink and accent.
        canvas: "#fafaf8",
        paper: "#ffffff",
        well: "#f2f1ee",
        line: "#e6e4e0",
        ink: {
          DEFAULT: "#111111",
          soft: "#5c5c5c",
          mute: "#737373",
        },
        accent: {
          DEFAULT: "#1f5c4a",
          soft: "#e3ede8",
        },
        danger: {
          DEFAULT: "#b42318",
          soft: "#fdecea",
        },
      },
      fontFamily: {
        sans: ["var(--font-archivo)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-archivo)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [typography],
};

export default config;
