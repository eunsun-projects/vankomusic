/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        mixed: ['var(--font-dunggeunmo)', 'var(--font-righteous)'],
      },
    },
  },
  plugins: [],
};
