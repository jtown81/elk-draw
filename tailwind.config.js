/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: '#0d1a12',
        grove: '#162110',
        canopy: '#1e2e1a',
        surface: '#162110',
        'surface-2': '#1e2e1a',
        sage: '#4d8a62',
        meadow: '#7dbf94',
        amber: {
          dark: '#c97d28',
          light: '#e8a542',
        },
        gold: '#e8a542',
        cream: '#ede8d6',
        parchment: '#b8ad92',
        bark: '#7a5230',
        danger: '#c0392b',
        warn: '#d4821a',
        border: '#2e4a2a',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
        body: ['Cabin', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '10px',
      },
    },
  },
  plugins: [],
}
