// import { blackA, mauve, violet } from '@radix-ui/colors'
import type { Config } from 'tailwindcss'

import baseConfig from '@revealed/tailwind-config'

export default {
  content: ['./src/**/*.tsx'],
  presets: [baseConfig],
  theme: {
    // extend: {
    //   colors: {
    //     ...blackA,
    //     ...violet,
    //     ...mauve,
    //   },
    // },
  },
  daisyui: {
    themese: [
      {
        revealed: {
          ...require('daisyui/src/colors/themes')['[data-theme=dark]'],
          primary: '#BA40D5',
          secondary: '#663DBC',
          accent: '#37cdbe',
          neutral: '#000000',
          'base-100': '#ffffff',
          keyframes: {
            overlayShow: {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
            contentShow: {
              from: {
                opacity: 0,
                transform: 'translate(-50%, -48%) scale(0.96)',
              },
              to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
            },
          },
          animation: {
            overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
            contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
          },
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
