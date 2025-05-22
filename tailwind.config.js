/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  safelist: [
    'from-[#A533CC]',
    'to-[#B16CEA]',
    'hover:from-[#9333ea]',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

