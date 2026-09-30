import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn-style theme tokens used by components/ui (black theme: white circle, black arrow)
        background: "#000000",
        foreground: "#ffffff",
        primary: "#ffffff",
        purple: {
          DEFAULT: "#6d45ff",
          soft: "#f7f2ff",
          line: "#e8e1ef",
        },
        pink: {
          DEFAULT: "#e747aa",
          soft: "#fff1f6",
        },
        ink: "#211a30",
        muted: "#756c7e",
        dark: "#171127",
        greenbg: "#edf9f1",
        greenline: "#287744",
        redbg: "#fff1f6",
        redline: "#8b2b61",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      borderRadius: {
        card: "27px",
        avatar: "34px",
      },
      boxShadow: {
        card: "0 14px 42px rgba(48,27,78,0.10)",
        avatar: "0 14px 30px rgba(109,69,255,0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
