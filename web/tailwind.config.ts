import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FDFBF7",
          100: "#FAF6EE",
          200: "#F2EADF",
          300: "#E4D7C5",
        },
        stage: {
          950: "#0B0B0E",
          900: "#121216",
          800: "#1B1B21",
          700: "#282832",
        },
        amberpoteto: {
          400: "#E8A95B",
          500: "#D48836",
          600: "#B56A20",
        },
        seal: {
          600: "#B83B3B",
          700: "#942A2A",
        },
        ink: {
          900: "#1A1715",
          700: "#3E3833",
          500: "#6F665E",
          400: "#948A81",
        },
      },
      fontFamily: {
        serif: [
          "Georgia",
          "'Noto Serif SC'",
          "'Songti SC'",
          "'STSong'",
          "serif",
        ],
        sans: [
          "'PingFang SC'",
          "'Hiragino Sans GB'",
          "'Noto Sans SC'",
          "'Microsoft YaHei'",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
