/** @type {import('tailwindcss').Config} */
import { defaultColors } from "./defaultColors";
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      notoR: ["notoR"],
      notoB: ["notoB"],
      oneMobile: ["oneMobile"],
      gmarket: ["gmarket"],
      scDream: ["scDream"],
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      md: "17px",
      lg: "18px",
      xl: "20px",
      "2xl": "22px",
      "3xl": "24px",
      "4xl": "26px",
      "5xl": "28px",

      f1: "12px",
      f2: "14px",
      f3: "16px",
      f4: "17px",
      f5: "18px",
      f6: "20px",
      f7: "22px",
      f8: "24px",
      f9: "26px",
      f10: "28px",
      f11: "30px",
      f12: "32px",
    },
    colors: {
      ...defaultColors,

      title: "#444444",
      text: "#777777",
      main: "#39906a",
      mainBorder: "#99bdad",
      secondary: "#1a8cff",
      third: "#ff7f0e",
      camaText: "#666666",
      camaColor: "#774F2D",
      camaColor1: "#FE8825",
      camaColorLight: "#FEBA00",

      camaBlue: "#162F6F",
      camaBlueLight: "#1474D0",

      mainSidehover: "#2572CA",
      mainSideopen: "#145CAE",
      body: "#64748B",
    },
    extend: {},
  },
  plugins: [],
};
