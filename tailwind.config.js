/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: { 50: '#f0f9ff', 500: '#0ea5e9', 600: '#0284c7', 900: '#0c0a09' },
        nebula: { purple: '#8b5cf6', pink: '#ec4899', dark: '#050505' }
      },
      fontFamily: { 
        heading: ['Syne', 'sans-serif'], 
        sans: ['Inter', 'sans-serif'] 
      }
    },
  },
  plugins: [],
}
