/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': [
          '"Plus Jakarta Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          'sans-serif',
        ],
        'display': [
          '"Outfit"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          'sans-serif',
        ],
      },
      colors: {
        'vibrant': {
          'pink': '#FF2D55',
          'rose': '#F43F5E',
          'purple': '#7928CA',
          'indigo': '#6366F1',
          'blue': '#0071E3',
          'cyan': '#06B6D4',
          'emerald': '#10B981',
          'orange': '#FF5E3A',
          'amber': '#F59E0B',
        },
        'apple': {
          'blue': '#0071e3',
          'blue-hover': '#0077ed',
          'blue-dark': '#0066cc',
          'blue-light': '#2997ff',
          'ink': '#1d1d1f',
          'ink-muted': '#86868b',
          'ink-subtle': '#6e6e73',
          'canvas': '#ffffff',
          'parchment': '#f5f5f7',
          'pearl': '#fafafc',
          'tile-1': '#272729',
          'tile-2': '#161617',
          'hairline': 'rgba(0, 0, 0, 0.08)',
          'hairline-dark': 'rgba(255, 255, 255, 0.12)',
        },
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'apple-md': '0 8px 24px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 20px 40px rgba(0, 0, 0, 0.08)',
        'apple-float': '0 30px 60px rgba(0, 0, 0, 0.12)',
        'glow-pink': '0 0 50px rgba(255, 45, 85, 0.4)',
        'glow-purple': '0 0 50px rgba(121, 40, 202, 0.4)',
        'glow-blue': '0 0 50px rgba(0, 113, 227, 0.4)',
        'glow-orange': '0 0 50px rgba(255, 94, 58, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
