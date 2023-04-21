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
  daisyui: {
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      {
        revealed: {
          ...require('daisyui/src/colors/themes')['[data-theme=dark]'],
          primary: '#BA40D5',
          secondary: '#663DBC',
          accent: '#37cdbe',
          neutral: '#000000',
          'base-100': '#ffffff',
        },
      },
    ],
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config
