import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        halloween: {
          dark: '#0D0D1A',
          darker: '#070710',
          purple: '#4A1B6D',
          'purple-light': '#7B2FBE',
          'purple-mid': '#5C2280',
          violet: '#1E1035',
          'violet-light': '#2D1B69',
          orange: '#FF6B00',
          'orange-light': '#FF8C38',
          amber: '#FFA500',
          green: '#00FF88',
          red: '#FF2D2D',
          ghost: '#E8E8F0',
          'ghost-muted': '#9090A8',
          'ghost-dim': '#5A5A72',
          glow: 'rgba(255,107,0,0.4)',
          'purple-glow': 'rgba(74,27,109,0.4)',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '45%': { opacity: '0.7' },
          '50%': { opacity: '0.5' },
          '55%': { opacity: '0.8' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255,107,0,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255,107,0,0.8), 0 0 60px rgba(255,107,0,0.4)' },
        },
        'pulse-glow-purple': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(74,27,109,0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(123,47,190,0.8), 0 0 60px rgba(74,27,109,0.4)' },
        },
        'bat-fly': {
          '0%': { transform: 'translateX(-60px) translateY(0px) scaleX(1)' },
          '50%': { transform: 'translateX(50vw) translateY(-40px) scaleX(1)' },
          '100%': { transform: 'translateX(110vw) translateY(10px) scaleX(1)' },
        },
        'ghost-rise': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        'particle-float': {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-10vh) rotate(360deg)', opacity: '0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-fast': 'float 2.5s ease-in-out infinite',
        flicker: 'flicker 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pulse-glow-purple': 'pulse-glow-purple 2s ease-in-out infinite',
        'bat-fly': 'bat-fly 8s linear infinite',
        'ghost-rise': 'ghost-rise 0.6s ease-out forwards',
        'particle-float': 'particle-float 8s linear infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
      },
      backgroundImage: {
        'halloween-gradient': 'linear-gradient(135deg, #0D0D1A 0%, #1E0A2E 50%, #0D0D1A 100%)',
        'purple-gradient': 'linear-gradient(135deg, #4A1B6D, #7B2FBE)',
        'orange-gradient': 'linear-gradient(135deg, #FF6B00, #FF8C38)',
        'xp-bar': 'linear-gradient(90deg, #4A1B6D, #FF6B00)',
        shimmer:
          'linear-gradient(90deg, transparent 0%, rgba(255,107,0,0.1) 50%, transparent 100%)',
      },
      boxShadow: {
        halloween: '0 0 20px rgba(255,107,0,0.3)',
        'halloween-lg': '0 0 40px rgba(255,107,0,0.5)',
        purple: '0 0 20px rgba(74,27,109,0.5)',
        'purple-lg': '0 0 40px rgba(123,47,190,0.6)',
        card: '0 4px 24px rgba(0,0,0,0.6)',
        glow: '0 0 15px rgba(255,107,0,0.4), 0 0 30px rgba(255,107,0,0.2)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
