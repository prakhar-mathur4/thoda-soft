/**
 * Tailwind is the theme's CSS build step: the same utility classes the original
 * design used are authored directly in the .liquid files and compiled to
 * assets/theme.css (committed, since Shopify serves static assets). This keeps
 * the exact design while the runtime is pure Liquid + vanilla JS.
 *
 * Build:  npm run build:css   (one-off)
 *         npm run watch:css   (during development)
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './blocks/**/*.liquid',
    './templates/**/*.liquid',
    './templates/**/*.json',
    './assets/**/*.js',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',
      cream: '#FEF9EB',
      blush: { DEFAULT: '#F6E7E4', deep: '#EBD3CE' },
      lavender: { DEFAULT: '#D8D2EC', deep: '#B7AEDC' },
      sage: { DEFAULT: '#CBD6C2', deep: '#A7B89C' },
      charcoal: { DEFAULT: '#895B3A', muted: '#A98A73' },
    },
    fontFamily: {
      serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      sans: ['var(--font-jost)', 'system-ui', 'sans-serif'],
    },
    extend: {
      screens: {
        'can-hover': { raw: '(hover: hover) and (pointer: fine)' },
        'no-hover': { raw: '(hover: none), (pointer: coarse)' },
      },
      borderRadius: { '4xl': '2rem' },
      transitionTimingFunction: { soft: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        fadeUp: 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 20s linear infinite',
        slideUp: 'slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        fadeIn: 'fadeIn 0.3s ease both',
      },
    },
  },
  plugins: [],
};
