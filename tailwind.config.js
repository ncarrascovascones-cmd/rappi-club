/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF4F0',
          100: '#FFE5DC',
          200: '#FFC6B3',
          300: '#FF9E80',
          400: '#FF7752',
          500: '#FF5A2C',
          600: '#F03D16',
          700: '#C92D0C',
          800: '#A1260F',
          900: '#7E2211',
        },
        ink: {
          DEFAULT: '#16161D',
          900: '#101016',
          800: '#1C1C25',
          700: '#2A2A35',
          500: '#686875',
          400: '#8D8D99',
          300: '#B7B7C2',
          200: '#DEDEE5',
          100: '#EFEFF3',
        },
        surface: '#F7F6F4',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Nunito', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(22,22,29,0.04), 0 10px 28px -18px rgba(22,22,29,0.22)',
        soft: '0 8px 24px -14px rgba(22,22,29,0.25)',
        glow: '0 14px 30px -12px rgba(240,61,22,0.55)',
        phone: '0 0 0 10px #111116, 0 0 0 11px #2b2b33, 0 40px 80px -20px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF7A3D 0%, #FF4F24 45%, #E0230F 100%)',
        'ink-gradient': 'linear-gradient(145deg, #23232D 0%, #14141A 60%, #0E0E13 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(-16px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        dash: { to: { strokeDashoffset: '-40' } },
        'pulse-ring': {
          '0%': { transform: 'scale(0.6)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        confetti: {
          '0%': { transform: 'translate(0,0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translate(var(--dx), var(--dy)) rotate(540deg)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.55s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.3s ease-out both',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.22,1,0.36,1) both',
        'slide-in-right': 'slide-in-right 0.38s cubic-bezier(0.22,1,0.36,1) both',
        'slide-up': 'slide-up 0.38s cubic-bezier(0.22,1,0.36,1) both',
        'toast-in': 'toast-in 0.35s cubic-bezier(0.22,1,0.36,1) both',
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 2.8s ease-in-out infinite',
        dash: 'dash 1.2s linear infinite',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
        confetti: 'confetti 1.4s cubic-bezier(0.2,0.7,0.3,1) forwards',
      },
    },
  },
  plugins: [],
};
