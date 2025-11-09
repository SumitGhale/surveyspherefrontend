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
        "primary-blue": "#059669",
        "secondary-accent": "#ED8D15",
        "secondary-blue": "#E8F0EC",
        "background-gray": "#F6F7F8",
        "card-background": "#F6F7F8",
        "active-blue": "#e8f6fd"
      },
    },
  },
  plugins: [],
};
