/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        // CSS 변수를 사용하는 동적 폰트 크기
        xs: "var(--font-xs)",
        sm: "var(--font-sm)",
        base: "var(--font-base)",
        lg: "var(--font-lg)",
        xl: "var(--font-xl)",
        "2xl": "var(--font-2xl)",
        "3xl": "var(--font-3xl)",
        "4xl": "var(--font-4xl)",
        "5xl": "var(--font-5xl)",
        // 고정 크기 (폰트 조절 영향 안받음)
        "xs-fixed": "0.75rem", // 12px
        "sm-fixed": "0.875rem", // 14px
        "base-fixed": "1rem", // 16px
        "lg-fixed": "1.125rem", // 18px
        "xl-fixed": "1.25rem", // 20px
        "2xl-fixed": "1.5rem", // 24px
        "3xl-fixed": "1.875rem", // 30px
        "4xl-fixed": "2.25rem", // 36px
        "5xl-fixed": "3rem", // 48px
      },
      colors: {
        camaColor: "hsl(var(--color-primary))",
        camaColor1: "hsl(var(--color-primary-light))",
        primary: {
          DEFAULT: "hsl(var(--color-primary))",
          hover: "hsl(var(--color-primary-hover))",
          light: "hsl(var(--color-primary-light))",
          foreground: "hsl(var(--color-primary-foreground))",
          thin: "hsl(var(--color-primary-thin))",
          text: "hsl(var(--color-primary-text))",
          lightText: "hsl(var(--color-primary-light-text))",
        },

        secondary: {
          DEFAULT: "hsl(var(--color-secondary))",
          foreground: "hsl(var(--color-secondary-foreground))",
          text: "hsl(var(--color-secondary-text))",
        },

        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",

        card: {
          DEFAULT: "hsl(var(--color-card))",
          foreground: "hsl(var(--color-card-foreground))",
        },

        popover: {
          DEFAULT: "hsl(var(--color-popover))",
          foreground: "hsl(var(--color-popover-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--color-muted))",
          foreground: "hsl(var(--color-muted-foreground))",
        },

        accent: {
          DEFAULT: "hsl(var(--color-accent))",
          foreground: "hsl(var(--color-accent-foreground))",
        },

        destructive: {
          DEFAULT: "hsl(var(--color-destructive))",
          foreground: "hsl(var(--color-destructive-foreground))",
        },

        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",
        tab: {
          bg: "hsl(var(--color-tab-bg))", // Inactive 배경 (#e6f0ff)
          text: "hsl(var(--color-tab-text))", // Inactive 글자 (#003366)
          activeBg: "hsl(var(--color-tab-active-bg))", // Active 배경 (#0066CC)
          activeText: "hsl(var(--color-tab-active-text))", // Active 글자 (#ffffff)
          hoverBg: "hsl(var(--color-tab-hover-bg))", // hover 배경 (#0066CC)
          hoverText: "hsl(var(--color-tab-hover-text))", // hover 글자 (#ffffff)
        },
        chart: {
          1: "hsl(var(--color-chart-1))",
          2: "hsl(var(--color-chart-2))",
          3: "hsl(var(--color-chart-3))",
          4: "hsl(var(--color-chart-4))",
          5: "hsl(var(--color-chart-5))",
        },
      },
      fontFamily: {
        sans: ["SUIT", "sans-serif"],
        suit: ["SUIT", "sans-serif"],
        jalnan: ["Jalnan", "sans-serif"],
        jalnanGothic: ["JalnanGothic", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        float: "float 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    ({ addUtilities }) => {
      addUtilities(
        {
          // flex
          ".flex-center": {
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
          },
          ".flex-between": {
            display: "flex",
            "align-items": "center",
            "justify-content": "space-between",
          },
          ".flex-col-center": {
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
            "justify-content": "center",
          },

          // grid
          ".grid-center": {
            display: "grid",
            "place-items": "center",
          },

          // absolute
          ".absolute-center": {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },

          // safe area padding for mobile devices
          ".pt-safe": {
            "padding-top": "max(1rem, env(safe-area-inset-top))",
          },
          ".pb-safe": {
            "padding-bottom": "max(1rem, env(safe-area-inset-bottom))",
          },
          ".pl-safe": {
            "padding-left": "max(1rem, env(safe-area-inset-left))",
          },
          ".pr-safe": {
            "padding-right": "max(1rem, env(safe-area-inset-right))",
          },

          // Korean text line-break optimization
          ".break-keep": {
            "word-break": "keep-all",
            "word-wrap": "break-word",
          },
        },
        ["responsive"],
      );
    },
  ],
};
