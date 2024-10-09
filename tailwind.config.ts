import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        borderColor: "#4c4d4f"
      },
      backgroundColor: {
        headerBg: "#1F2023",
      },
      height: {
        '12vh': '12vh',
      }
    },
  },
  plugins: [],
};
export default config;
