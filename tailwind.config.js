/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d946ef',
        primaryGlow: '#f0abfc',
        secondary: '#06b6d4',
        secondaryGlow: '#67e8f9',
        accent: '#8b5cf6',
        surface: '#111827',
        background: '#030712',
        success: '#00ff9d',
        danger: '#ff0055',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } }
      },
      boxShadow: {
        'neon-primary': '0 0 10px rgba(217, 70, 239, 0.5), 0 0 20px rgba(217, 70, 239, 0.3)',
        'neon-secondary': '0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)',
      }
    }
  },
  plugins: [],
}