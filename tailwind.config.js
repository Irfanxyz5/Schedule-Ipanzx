/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
      colors: {
        bg: {
          base:    '#06091A',
          surface: '#0C1228',
          card:    '#111D35',
          hover:   '#162040',
        },
        gold: {
          DEFAULT: '#E8B86D',
          light:   '#F5D499',
          dark:    '#B88A40',
          muted:   'rgba(232,184,109,0.15)',
        },
        slate: {
          text:    '#EDE8DC',
          muted:   '#8A9BB5',
          border:  'rgba(138,155,181,0.18)',
        },
        status: {
          success: '#4ADE80',
          warning: '#FB923C',
          danger:  '#F87171',
          info:    '#60A5FA',
        },
      },
      boxShadow: {
        card:   '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(232,184,109,0.08) inset',
        glow:   '0 0 30px rgba(232,184,109,0.15)',
        modal:  '0 25px 80px rgba(0,0,0,0.7)',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease forwards',
        'fade-up':      'fadeUp 0.5s ease forwards',
        'slide-in-r':   'slideInRight 0.35s ease forwards',
        'slide-in-l':   'slideInLeft 0.35s ease forwards',
        'scale-in':     'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'shimmer':      'shimmer 2s infinite linear',
        'float':        'float 3s ease-in-out infinite',
        'pulse-gold':   'pulseGold 2s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn:       { from: { opacity: 0 },                    to: { opacity: 1 } },
        fadeUp:       { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: 0, transform: 'translateX(30px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        slideInLeft:  { from: { opacity: 0, transform: 'translateX(-30px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        scaleIn:      { from: { opacity: 0, transform: 'scale(0.85)' }, to: { opacity: 1, transform: 'scale(1)' } },
        shimmer:      { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:        { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        pulseGold:    { '0%,100%': { boxShadow: '0 0 0 0 rgba(232,184,109,0)' }, '50%': { boxShadow: '0 0 0 8px rgba(232,184,109,0.12)' } },
      },
    },
  },
  plugins: [],
}
