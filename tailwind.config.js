/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ブランドカラー
        brand: {
          primary: '#8B4513',
          secondary: '#D2B48C',
          accent: '#DC143C',
        },
        // 和風アクセント
        washi: '#F5F5DC',
        sumi: '#2F2F2F',
        kinari: '#FFFEF7',
        urushi: '#8B0000',
        // アクション色
        like: '#FF6B6B',
        skip: '#95A5A6',
      },
      fontFamily: {
        sans: ['Hiragino Sans', 'Yu Gothic Medium', 'Meiryo', 'Noto Sans JP', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(139, 69, 19, 0.1)',
        'card-hover': '0 4px 16px rgba(139, 69, 19, 0.15)',
      },
      animation: {
        'swipe-right': 'swipeRight 0.4s ease-out forwards',
        'swipe-left': 'swipeLeft 0.4s ease-out forwards',
        'card-enter': 'cardEnter 0.3s ease-out',
      },
      keyframes: {
        swipeRight: {
          '0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateX(300px) rotate(25deg)', opacity: '0' },
        },
        swipeLeft: {
          '0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateX(-300px) rotate(-25deg)', opacity: '0' },
        },
        cardEnter: {
          '0%': { transform: 'scale(0.8) translateY(20px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}