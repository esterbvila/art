/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // Design tokens from prototypes-art-store.pen variables
      colors: {
        'bg-main':    '#FAF8F5',
        'bg-warm':    '#F0ECE6',
        'bg-deep':    '#1A1917',
        'bg-stone':   '#E8E3DB',
        accent:       '#C4724E',
        divider:      '#DDD8D0',
        'divider-dark': '#2A2926',
        'text-primary':    '#1A1917',
        'text-secondary':  '#6B6660',
        'text-tertiary':   '#9C9690',
        'text-light':      '#FAF8F5',
        'text-light-muted':'#A8A29C',
      },
      fontFamily: {
        sans: ['"Funnel Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        wide3: '0.1875rem', // 3px
      },
      lineHeight: {
        tight95: '0.95',
      },
    },
  },
  plugins: [],
};
