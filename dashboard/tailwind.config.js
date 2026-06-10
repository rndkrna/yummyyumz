/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bakeryBg: '#F3EAD3',
        bakeryBerry: '#A61C3C',
        bakeryText: '#4A3E3D',
        bakeryPeach: '#FCDAD1',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
