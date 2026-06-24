/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tide: {
          deep: '#0B3D52',
          mid: '#1A6B8A',
          light: '#4CA8C8',
          foam: '#D6EEF7',
          sand: '#F7F3EE',
          gold: '#C8923A',
          success: '#1A6B4A',
          warn: '#8A6010',
          danger: '#8A1A1A',
          muted: '#5A7A8A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
