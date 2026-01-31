/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        traffic: {
          green: "#22c55e",
          yellow: "#eab308",
          orange: "#f97316",
          "red-orange": "#ef4444",
          red: "#dc2626",
        },
        status: {
          success: "hsl(var(--success))",
          "success-foreground": "hsl(var(--success-foreground))",
          warning: "hsl(var(--warning))",
          "warning-foreground": "hsl(var(--warning-foreground))",
          error: "hsl(var(--error))",
          "error-foreground": "hsl(var(--error-foreground))",
          pending: "hsl(var(--pending))",
          "pending-foreground": "hsl(var(--pending-foreground))",
        },
        purple: {
          DEFAULT: "hsl(270 60% 45%)",
          light: "hsl(270 60% 60%)",
          dark: "hsl(270 60% 35%)",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
