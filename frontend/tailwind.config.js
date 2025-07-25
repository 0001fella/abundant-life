/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        dark: "#0b0b2e",
        light: "#f5f5f5",
        accent: "#e0aaff",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      spacing: {
        navbar: "80px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};