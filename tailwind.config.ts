import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "var(--bg-primary)",
          surface: "var(--bg-surface)",
          card: "var(--bg-card)",
          cardHover: "var(--bg-card-hover)",
          border: "var(--border-color)",
          borderGold: "var(--border-gold)",
          gold: {
            DEFAULT: "#D1AD62",
            light: "#E5C885",
            dark: "#A38032",
            hover: "#DEBD74",
          },
          purple: {
            DEFAULT: "#632B78",
            light: "#853BA2",
            dark: "#451B54",
            glow: "rgba(99, 43, 120, 0.35)",
          },
          text: {
            DEFAULT: "var(--text-primary)",
            muted: "var(--text-muted)",
            dim: "var(--text-dim)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-cinzel)", "serif"],
      },
      boxShadow: {
        gold: "0 0 25px -5px rgba(209, 173, 98, 0.25)",
        purple: "0 0 30px -5px rgba(99, 43, 120, 0.35)",
        luxury: "0 10px 30px -10px rgba(0, 0, 0, 0.1), 0 0 1px 1px rgba(209, 173, 98, 0.2)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D1AD62 0%, #F5DE9C 50%, #B89242 100%)",
        "gold-gradient-hover": "linear-gradient(135deg, #DEBD74 0%, #FFF0BD 50%, #C9A353 100%)",
        "purple-gradient": "linear-gradient(135deg, #632B78 0%, #873CA4 50%, #471A57 100%)",
        "dark-radial": "radial-gradient(circle at 50% 0%, rgba(99, 43, 120, 0.18) 0%, rgba(11, 11, 13, 0) 70%)",
        "luxury-hero": "var(--hero-bg)",
      },
    },
  },
  plugins: [],
};

export default config;
