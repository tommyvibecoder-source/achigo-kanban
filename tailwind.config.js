/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        jira: {
          blue: '#0052CC',
          darkBlue: '#0747A6',
          bg: '#F4F5F7',
          border: '#DFE1E6',
          text: '#172B4D',
          subtle: '#6B778C',
          darkBg: '#0F172A',
          darkCard: '#1E293B',
          darkBorder: '#334155'
        }
      }
    },
  },
  plugins: [],
}
