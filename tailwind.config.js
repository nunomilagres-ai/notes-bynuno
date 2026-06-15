/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFF6E8',
          100: '#FFF0D4',
          200: '#F0D9A8',
          300: '#E8C470',
          400: '#E8A838',
          500: '#D4822E',
          600: '#C97A20',
          700: '#A85F10',
          800: '#7A4508',
          900: '#3d2004',
        },
        surface: {
          bg:     '#FAF7F2',
          card:   '#FFFCF8',
          border: '#E4DDD4',
          muted:  '#F0ECE4',
        },
        ink: {
          DEFAULT: '#1a1614',
          secondary: '#5a4e44',
          muted:     '#a89f96',
          faint:     '#c8bfb6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in':  'fade-in 0.18s ease-out',
        'slide-in': 'slide-in 0.18s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}