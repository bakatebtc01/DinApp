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
        brand: {
          red: '#CE1126',
          gold: '#F7CC00',
          black: '#000000',
        },
        png: {
          red: '#CE1126',
          gold: '#F7CC00',
        }
      }
    },
  },
  plugins: [],
}
