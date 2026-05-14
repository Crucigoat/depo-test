import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00f5ff',
        'neon-violet': '#7c3aed',
        'neon-gold': '#f59e0b',
        'neon-green': '#00ff88',
        'dark': '#0a0a0f',
        'dark-2': '#111118',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0,245,255,0.3), 0 0 40px rgba(0,245,255,0.1)',
        'neon-violet': '0 0 20px rgba(124,58,237,0.3), 0 0 40px rgba(124,58,237,0.1)',
        'neon-gold': '0 0 20px rgba(245,158,11,0.3), 0 0 40px rgba(245,158,11,0.1)',
        'neon-green': '0 0 20px rgba(0,255,136,0.3), 0 0 40px rgba(0,255,136,0.1)',
      },
    },
  },
  plugins: [],
}

export default config
