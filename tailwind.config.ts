import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        acl: {
          50:  "#e9fbfb",
          100: "#ccf6f6",
          200: "#9eecf0",
          300: "#66dde8",
          400: "#22ffd6",   // pumped neon teal
          500: "#0fb6d3",
          600: "#0d96b0",
          700: "#0e788c",
          800: "#115f70",
          900: "#114f5d",
        },
        indigoGlow: {
          400: "#7aa2ff",
          500: "#587dff",
          600: "#4a5de6",
        },
      },
      backgroundImage: {
        "acl-gradient": "linear-gradient(135deg, #22ffd6 0%, #7aa2ff 100%)",
        "acl-card": "radial-gradient(1200px circle at 0% 0%, rgba(255,255,255,.14), rgba(255,255,255,0))",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,.08), 0 8px 30px rgba(0,0,0,.28)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
