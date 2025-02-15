import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        'bounce-horizontal': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(3px)' },
        },
        'bounce-horizontal-reverse': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-3px)' },
        }
      },
      animation: {
        'bounce-horizontal': 'bounce-horizontal 1s infinite',
        'bounce-horizontal-active': 'bounce-horizontal 0.5s infinite',
        'bounce-horizontal-reverse': 'bounce-horizontal-reverse 1s infinite',
        'bounce-horizontal-reverse-active': 'bounce-horizontal-reverse 0.5s infinite',
      }
    },
  },
  plugins: [],
} satisfies Config;
