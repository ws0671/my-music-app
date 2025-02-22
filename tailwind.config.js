/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard-Regular", "sans-serif"],
        gmarket: ["GmarketSansMedium", "sans-serif"],
        dongle: ["Dongle", "serif"],
        jua: ["Jua", "serif"],
      },
      animation: {
        appear: "appear 1s",
        marquee: "marquee 10s linear infinite",
        marquee2: "marquee 5s linear infinite",
      },
      keyframes: {
        appear: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        marquee: {
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        "@font-face": {
          fontFamily: "Pretendard-Regular",
          src: 'url(https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff) format("woff")',
          fontWeight: "400",
          fontStyle: "normal",
        },
        "@font-face": {
          fontFamily: "GmarketSansMedium",
          src: 'url(https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff) format("woff")',
          fontWeight: "normal",
          fontStyle: "normal",
        },
        "@font-face": {
          fontFamily: "Dongle",
          src: 'url(https://fonts.googleapis.com/css2?family=Dongle:wght@400&display=swap) format("woff2")',
          fontWeight: "400",
          fontStyle: "normal",
        },
        "@font-face": {
          fontFamily: "Jua",
          src: 'url(https://fonts.googleapis.com/css2?family=Jua&display=swap) format("woff2")',
          fontWeight: "400",
          fontStyle: "normal",
        },
      });
    },
    require("tailwind-scrollbar-hide"),
  ],
};
