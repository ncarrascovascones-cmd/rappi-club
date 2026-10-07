/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0B1F3A', 800: '#132B4D', 700: '#1C3A63', 600: '#2A4A75' },
        brand: { DEFAULT: '#2563EB', 50: '#EFF4FF', 100: '#DBE6FE', 200: '#BFD3FE', 600: '#1D4FD8', 700: '#1E40AF' },
        ok: { DEFAULT: '#16A34A', 50: '#ECFDF3', 100: '#D1FADF', 700: '#15803D' },
        warn: { DEFAULT: '#D97706', 50: '#FFF8EB', 100: '#FEEFC7' },
        danger: { DEFAULT: '#DC2626', 50: '#FEF2F2', 100: '#FEE2E2' },
        surface: '#F5F7FA',
        line: '#E6EAF0',
        ink: { DEFAULT: '#0B1F3A', 2: '#475569', 3: '#64748B', 4: '#94A3B8' },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,31,58,0.04), 0 4px 16px rgba(11,31,58,0.06)',
        lift: '0 8px 30px rgba(11,31,58,0.12)',
        phone: '0 0 0 10px #0B1220, 0 0 0 11px #2A3446, 0 40px 80px -20px rgba(11,31,58,0.45)',
        glow: '0 8px 24px -6px rgba(37,99,235,0.55)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'scale-in': { '0%': { opacity: 0, transform: 'scale(0.92)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        'slide-down': { '0%': { opacity: 0, transform: 'translateY(-110%)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'sheet-up': { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        ping2: { '0%': { transform: 'scale(1)', opacity: 0.55 }, '80%,100%': { transform: 'scale(2.4)', opacity: 0 } },
        'draw-check': { '0%': { strokeDashoffset: 48 }, '100%': { strokeDashoffset: 0 } },
        ring: { '0%,100%': { transform: 'rotate(0)' }, '15%': { transform: 'rotate(14deg)' }, '30%': { transform: 'rotate(-12deg)' }, '45%': { transform: 'rotate(8deg)' }, '60%': { transform: 'rotate(-4deg)' }, '75%': { transform: 'rotate(0)' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '20%,60%': { transform: 'translateX(-6px)' }, '40%,80%': { transform: 'translateX(6px)' } },
      },
      animation: {
        'fade-up': 'fade-up .45s cubic-bezier(.2,.8,.2,1) both',
        'fade-in': 'fade-in .3s ease-out both',
        'scale-in': 'scale-in .35s cubic-bezier(.2,.8,.2,1) both',
        'slide-down': 'slide-down .45s cubic-bezier(.2,.8,.2,1) both',
        'sheet-up': 'sheet-up .4s cubic-bezier(.2,.8,.2,1) both',
        ping2: 'ping2 2s cubic-bezier(0,0,.2,1) infinite',
        'draw-check': 'draw-check .5s .15s ease-out both',
        ring: 'ring 1.4s ease-in-out .2s 2',
        shake: 'shake .4s ease-in-out',
      },
    },
  },
  plugins: [],
};
