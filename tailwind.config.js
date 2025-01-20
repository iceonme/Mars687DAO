/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        'mars-red': '#CC3B2B',         // 降低亮度
        'mars-dark': '#1A0F0F',
        'mars-surface': '#2D1414',
        'mars-accent': '#E84835',      // 降低亮度的 hover 状态
      },
      backgroundImage: {
        'mars-gradient': 'linear-gradient(180deg, #2D1414 0%, #1A0F0F 100%)',
      },
    },
  },
  plugins: [],
}