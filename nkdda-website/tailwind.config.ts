import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'nkd-green': '#0b3d2e',
        'nkd-light-green': '#145a32',
        'nkd-gold': '#c9a227',
        'nkd-bg': '#f4f8f6',
      },
    },
  },
  plugins: [],
}
export default config
