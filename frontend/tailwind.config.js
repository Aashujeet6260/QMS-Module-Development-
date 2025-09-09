/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#3b82f6', // blue-500
          'dark': '#2563eb',   // blue-600
        },
        'background': '#f8fafc', // slate-50
        'surface': '#ffffff',   // white
        'text-primary': '#1e293b',   // slate-800
        'text-secondary': '#64748b', // slate-500
        'border': '#e2e8f0',     // slate-200
        'success': '#16a34a',    // green-600
        'warning': '#f97316',    // orange-500
        'danger': '#ef4444',     // red-500
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07)',
      },
      keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.3s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}