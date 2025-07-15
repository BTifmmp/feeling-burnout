/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: require("./constants/tailwindColors").tailwindColorsLight,
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
        '7xl': '3.5rem',
      },
      padding: {
        'card': '1.25rem',
        'sides': '1.25rem',
      },
      margin: {
        'card': '1rem',
        'sides': '1rem',
      },
      borderWidth: {
        '3': '3px',
      },

    },
    plugins: [],
  }
}