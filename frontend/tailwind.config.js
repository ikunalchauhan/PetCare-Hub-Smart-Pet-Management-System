/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefdf6',
          100: '#d6f9e8',
          200: '#aff1d3',
          300: '#78e3b8',
          400: '#3ecd98',
          500: '#17b37f',
          600: '#0c9268',
          700: '#0a7455',
          800: '#0b5c46',
          900: '#0a4c3b',
          950: '#042b21',
        },
        ocean: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#59b0ff',
          500: '#328eff',
          600: '#1a6df5',
          700: '#1557e1',
          800: '#1846b6',
          900: '#193f8f',
        },
        sand: {
          50: '#fbf9f4',
          100: '#f4efe1',
          200: '#e8ddc2',
          300: '#d8c497',
          400: '#c8a86c',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(10, 76, 59, 0.12)',
        'glass-lg': '0 20px 60px -10px rgba(10, 76, 59, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
      },
    },
  },
  plugins: [],
}
