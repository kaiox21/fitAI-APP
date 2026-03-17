/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        'primary-light': '#A78BFA',
        'primary-dark': '#5B21B6',
        dark: '#0F0F0F',
        'dark-card': '#1A1A1A',
        'dark-border': '#2A2A2A',
      }
    },
  },
  plugins: [],
}