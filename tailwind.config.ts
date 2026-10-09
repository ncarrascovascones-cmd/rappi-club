import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF3EF',
          100: '#FFE4DA',
          200: '#FFC5B1',
          300: '#FF9F80',
          400: '#FF7A55',
          500: '#FF5B35',
          600: '#EE4119',
          700: '#C63010',
          800: '#9E2912',
          900: '#7F2614',
        },
        ink: {
          DEFAULT: '#15151C',
          950: '#0C0C11',
          900: '#15151C',
          800: '#20202A',
          700: '#2E2E3A',
          600: '#4A4A57',
          500: '#6B6B78',
          400: '#8E8E9A',
          300: '#B9B9C4',
          200: '#DFDFE6',
          100: '#EEEEF2',
          50: '#F6F6F8',
        },
        mint: {
          50: '#E9FBF3',
          100: '#CDF5E3',
          200: '#9BEACB',
          400: '#2FCB8F',
          500: '#12B07A',
          600: '#0A8F62',
          700: '#0B7250',
        },
        sun: {
          50: '#FFF8E6',
          100: '#FFEDBF',
          400: '#FFBE2E',
          500: '#F5A300',
          700: '#A86A00',
        },
        sky: {
          50: '#EEF5FF',
          100: '#DAE9FF',
          500: '#2A78D6',
          600: '#1F62B5',
        },
        grape: {
          50: '#F3F0FF',
          100: '#E6DFFF',
          500: '#6D55E0',
          600: '#5842C4',
        },
        surface: '#F6F5F2',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(21,21,28,0.04), 0 12px 32px -20px rgba(21,21,28,0.25)',
        lift: '0 2px 4px rgba(21,21,28,0.05), 0 22px 44px -22px rgba(21,21,28,0.35)',
        glow: '0 16px 34px -14px rgba(238,65,25,0.6)',
        inset: 'inset 0 0 0 1px rgba(21,21,28,0.06)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF8A4C 0%, #FF5B35 45%, #E0301A 100%)',
        'ink-gradient': 'linear-gradient(150deg, #2A2A36 0%, #16161D 55%, #0C0C11 100%)',
        'mint-gradient': 'linear-gradient(135deg, #2FCB8F 0%, #0A8F62 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'sheet-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(-12px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        typing: {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '40%': { transform: 'translateY(-3px)', opacity: '1' },
        },
        'grow-x': { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
        'grow-y': { '0%': { transform: 'scaleY(0)' }, '100%': { transform: 'scaleY(1)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.45s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        'fade-in': 'fade-in 0.3s ease-out both',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        'sheet-up': 'sheet-up 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'toast-in': 'toast-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        shimmer: 'shimmer 1.4s linear infinite',
        'pulse-ring': 'pulse-ring 1.6s ease-out infinite',
        typing: 'typing 1.1s ease-in-out infinite',
        'grow-x': 'grow-x 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        'grow-y': 'grow-y 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
