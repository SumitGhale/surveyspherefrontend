/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#15A4EC",
        "secondary-blue": "#D1EDFC",
        "background-gray": "#F6F7F8",
        "card-background": "#F7F7F5",
      },
    },
  },
  plugins: [],
};
