import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "#2d6cdf",
          2: "#16b7d9",
          3: "#0e1f4f",
          4: "#78b4ff",
          5: "#7ee0d6"
        },
        tier: {
          base: "#9aa8bf",
          partner: "#2d6cdf",
          elite: "#16b7d9",
          strategic: "#0fa968"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      },
      boxShadow: {
        panel: "0 24px 60px rgba(9, 27, 74, 0.10)",
        soft: "0 10px 30px rgba(16, 44, 102, 0.08)"
      },
      fontFamily: {
        sans: [
          "Manrope",
          "Segoe UI",
          "sans-serif"
        ],
        display: [
          "Rajdhani",
          "Manrope",
          "sans-serif"
        ]
      },
      backgroundImage: {
        "app-grid": "radial-gradient(circle at top, rgba(45,108,223,0.08), transparent 32%), linear-gradient(180deg, rgba(15,23,42,0.92), rgba(8,15,35,0.98))"
      }
    }
  },
  plugins: []
};

export default config;
