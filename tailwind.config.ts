import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#e0eaff",
          500: "#4f6ef7",
          600: "#3b5bf5",
          700: "#2a47e8",
          900: "#1a2d8f",
        },
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
        "pulse-soft": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
