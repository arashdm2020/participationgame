import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Foundation
        bg: {
          root: '#07090C',
          surface: '#0D1117',
          elevated: '#161B22',
          hover: '#1C2128',
        },
        border: {
          subtle: '#21262D',
          DEFAULT: '#30363D',
        },
        // Text
        text: {
          primary: '#F0F6FC',
          secondary: '#8B949E',
          tertiary: '#484F58',
          inverse: '#0D1117',
        },
        // Accent
        accent: {
          primary: '#10B981',
          'primary-hover': '#34D399',
          'primary-muted': 'rgba(16, 185, 129, 0.15)',
          secondary: '#3B82F6',
          'secondary-muted': 'rgba(59, 130, 246, 0.15)',
        },
        // Status
        status: {
          success: '#10B981',
          'success-bg': 'rgba(16, 185, 129, 0.12)',
          warning: '#F59E0B',
          'warning-bg': 'rgba(245, 158, 11, 0.12)',
          danger: '#EF4444',
          'danger-bg': 'rgba(239, 68, 68, 0.12)',
          info: '#3B82F6',
          'info-bg': 'rgba(59, 130, 246, 0.12)',
          neutral: '#6B7280',
          'neutral-bg': 'rgba(107, 114, 128, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
        vazir: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'display-2': ['36px', { lineHeight: '1.15', fontWeight: '700' }],
        'heading-1': ['24px', { lineHeight: '1.25', fontWeight: '600' }],
        'heading-2': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-3': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'card': '12px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'countdown-pulse': 'countdown-pulse 1s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'countdown-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
      },
      container: {
        center: true,
        padding: '1.5rem',
      },
    },
  },
  plugins: [],
}

export default config
