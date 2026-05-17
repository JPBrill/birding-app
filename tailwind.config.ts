import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // AIRA primary — deep navy
        aira: {
          50:  '#f0f4ff',
          100: '#e0e8ff',
          200: '#c0d0ff',
          300: '#93abfc',
          400: '#6180f8',
          500: '#3d5af1',
          600: '#2a3de6',
          700: '#1e2ecc',
          800: '#1a27a6',
          900: '#1a2580',
          950: '#111640',
        },
        // AIRA gold accent
        gold: {
          100: '#fef9ec',
          200: '#fdefc4',
          300: '#fad97a',
          400: '#f7c040',
          500: '#f4a912',
          600: '#d98608',
          700: '#b56306',
          800: '#924c0c',
          900: '#783f0f',
        },
        // Keep forest for any legacy refs
        forest: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        earth: {
          100: '#fef3c7',
          400: '#fbbf24',
          600: '#d97706',
          800: '#92400e',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
