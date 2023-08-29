import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{jsx,tsx}", "./wallpaper.html"],
  theme: {
    extend: {},
    colors: {
      white: colors.white,
      black: colors.black,
      yellow: colors.yellow,
      red: colors.red,
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
