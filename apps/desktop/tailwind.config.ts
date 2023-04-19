import type { Config } from 'tailwindcss'

import baseConfig from '@revealed/tailwind-config'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/frontend/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [baseConfig],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
