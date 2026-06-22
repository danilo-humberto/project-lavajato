import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#06245c",
        ocean: "#0069e8",
        aqua: "#10bde6",
        mist: "#eaf9ff",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(2, 132, 199, 0.14)",
        card: "0 12px 34px rgba(8, 47, 73, 0.09)",
      },
    },
  },
  plugins: [],
} satisfies Config;
