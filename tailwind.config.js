/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#DC2626", // red-600
        background: "#09090b", // zinc-950
        surface: "#18181b", // zinc-900
      },
    },
  },
  plugins: [],
}
