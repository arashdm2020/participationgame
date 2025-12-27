import type { Config } from 'tailwindcss'

/**
 * PARTICIPATION GAME - DESIGN SYSTEM v3.0
 * ========================================
 * Strict 3-color system: Black, Gold, White
 * Dark-mode first, premium financial interface
 */

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // === CORE PALETTE (Only 3 colors) ===
        
        // Black spectrum (surfaces)
        void: '#000000',
        depth: '#050505',
        base: '#0A0A0A',
        surface: '#111111',
        elevated: '#181818',
        raised: '#1F1F1F',
        
        // Gold spectrum (accent & emphasis)
        gold: {
          DEFAULT: '#C9A227',
          bright: '#E5B82A',
          dim: '#9A7B1E',
          muted: 'rgba(201, 162, 39, 0.15)',
          subtle: 'rgba(201, 162, 39, 0.08)',
        },
        
        // White spectrum (text & borders)
        white: {
          DEFAULT: '#FFFFFF',
          primary: '#FAFAFA',
          secondary: '#A0A0A0',
          tertiary: '#606060',
          muted: '#404040',
          ghost: '#252525',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Display - Large numbers, hero values
        'display-xl': ['64px', { lineHeight: '1', fontWeight: '300', letterSpacing: '-0.02em' }],
        'display-lg': ['48px', { lineHeight: '1.05', fontWeight: '300', letterSpacing: '-0.02em' }],
        'display-md': ['36px', { lineHeight: '1.1', fontWeight: '400', letterSpacing: '-0.01em' }],
        
        // Headings
        'h1': ['28px', { lineHeight: '1.2', fontWeight: '500', letterSpacing: '-0.01em' }],
        'h2': ['22px', { lineHeight: '1.25', fontWeight: '500' }],
        'h3': ['18px', { lineHeight: '1.3', fontWeight: '500' }],
        'h4': ['15px', { lineHeight: '1.4', fontWeight: '500' }],
        
        // Body
        'body': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['11px', { lineHeight: '1.4', fontWeight: '400', letterSpacing: '0.02em' }],
        
        // Mono (numbers, addresses)
        'mono-lg': ['20px', { lineHeight: '1.2', fontWeight: '500' }],
        'mono-md': ['16px', { lineHeight: '1.3', fontWeight: '400' }],
        'mono-sm': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
      },
      borderWidth: {
        'DEFAULT': '1px',
        'thin': '0.5px',
      },
      boxShadow: {
        'none': 'none',
        'subtle': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.6)',
        'gold-glow': '0 0 24px rgba(201, 162, 39, 0.2)',
        'gold-soft': '0 0 12px rgba(201, 162, 39, 0.1)',
        'inner-gold': 'inset 0 0 0 1px rgba(201, 162, 39, 0.2)',
      },
      animation: {
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'tick': 'tick 1s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        tick: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        breathe: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      transitionDuration: {
        'fast': '100ms',
        'normal': '200ms',
        'slow': '400ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
}

export default config
