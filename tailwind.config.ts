import type { Config } from "tailwindcss";

/** Helper: expose a CSS custom property as an rgb() color that accepts
 *  Tailwind's `<alpha-value>` placeholder, so `bg-bg-primary/85` works. */
const rgbVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-vazirmatn)", "system-ui", "sans-serif"],
      },
      colors: {
        bg: {
          primary: rgbVar("--bg-primary"),
          card: rgbVar("--bg-card"),
          "card-hover": rgbVar("--bg-card-hover"),
          elevated: rgbVar("--bg-elevated"),
        },
        accent: {
          DEFAULT: rgbVar("--accent"),
          hover: rgbVar("--accent-hover"),
          // `--accent-soft` is an rgba() that already bakes alpha; expose as-is.
          soft: "var(--accent-soft)",
          text: rgbVar("--accent-text"),
        },
        fg: {
          primary: rgbVar("--text-primary"),
          secondary: rgbVar("--text-secondary"),
          muted: rgbVar("--text-muted"),
        },
        line: {
          DEFAULT: "var(--border)",
          hover: "var(--border-hover)",
        },
        success: rgbVar("--success"),
        danger: rgbVar("--danger"),
        search: rgbVar("--search-bg"),
        chip: {
          bg: "var(--chip-bg)",
          border: "var(--chip-border)",
        },
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
        "slide-in-left": "slideInLeft 0.3s ease-out forwards",
        shimmer: "shimmer 1.6s linear infinite",
        "pulse-scale": "pulseScale 0.3s ease-out",
        "bounce-in": "bounceIn 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        pulseScale: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.12)" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
