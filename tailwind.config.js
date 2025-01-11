import tailwindAnimate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          '70': 'rgba(2, 159, 230, 0.7)',
          '20': 'rgba(2, 159, 230, 0.2)',
          '30': 'rgba(2, 159, 230, 0.3)',
          '10': 'rgba(2, 159, 230, 0.1)',
          '15': 'rgba(190, 228, 247, 0.85)',
          DEFAULT: '#029FE6'
        },
        secondary: '#183867',
        accTitle: '#818181',
        black: '#000000',
        darkBlue: '#183867',
        brightBlue: '#029FE6',
      },
      gradientColorStops: {
        '0': '#000000',
        '47': '#183867',
        // '57': '#183867',
        '57': '#029FE6',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontSize: {
        stat: '32px',
        lg: '18px',
        md: '16px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
    }
  },
  plugins: [tailwindAnimate],
}
