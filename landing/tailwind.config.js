/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bakeryBg: "#F3EAD3",
        bakeryBerry: "#A61C3C",
        bakeryText: "#4A3E3D",
        bakeryPeach: "#FCDAD1",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ['"Plus Jakarta Sans"', "sans-serif"],
        groovy: ["Shrikhand", "cursive"],
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
        1200: "1200ms",
        1500: "1500ms",
        2000: "2000ms",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        "smooth-in": "cubic-bezier(0.4, 0, 1, 1)",
        "smooth-out": "cubic-bezier(0, 0, 0.2, 1)",
        "smooth-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
