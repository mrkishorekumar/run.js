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
        borderColor: "#4c4d4f",
        blue: "#0556f3",
      },
      backgroundColor: {
        headerBg: "#1f2023",
        navbarBg: "#2d2f34",
        ideBg: "#1E1E1E",
        outputBg: "#242424",
        blueBtn: "#0556f3",
        modalBg: "#2D2F34",
      },
      height: {
        "12vh": "12vh",
        "7vh": "7vh",
        "88vh": "88vh",
        "81vh": "81vh",
        "93vh": "93vh",
        "86vh": "86vh",
        "100vh": "100vh",
        "92p": "92%",
      },
    },
  },
  plugins: [],
};
export default config;
