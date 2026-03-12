import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#00d4ff',
        'bg-base': '#020b14',
        'bg-2': '#030e1a',
        'border-dim': 'rgba(0,212,255,0.15)',
      },
      fontFamily: {
        sans: ['"Exo 2"', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(0,212,255,0.4)',
        'neon-sm': '0 0 10px rgba(0,212,255,0.3)',
      },
    },
  },
  plugins: [],
}
export default config