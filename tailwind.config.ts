import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Custom theme — intentionally NOT extending the default Tailwind palette.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',
      // Brand palette
      cream: '#FEF9EB', // primary background — warm soft ivory
      blush: {
        DEFAULT: '#F6E7E4', // soft blush pink
        deep: '#EBD3CE',
      },
      lavender: {
        DEFAULT: '#D8D2EC',
        deep: '#B7AEDC',
      },
      sage: {
        DEFAULT: '#CBD6C2',
        deep: '#A7B89C',
      },
      charcoal: {
        DEFAULT: '#895B3A', // warm brown — primary text & buttons
        muted: '#A98A73', // softened brown for secondary text
      },
    },
    fontFamily: {
      serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      sans: ['var(--font-jost)', 'system-ui', 'sans-serif'],
    },
    extend: {
      // Input-capability variants: distinguish real hover (mouse) from touch.
      screens: {
        'can-hover': { raw: '(hover: hover) and (pointer: fine)' },
        'no-hover': { raw: '(hover: none), (pointer: coarse)' },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
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
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
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

export default config;
