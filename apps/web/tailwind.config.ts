import { blackA, mauve, violet } from '@radix-ui/colors'
import type { Config } from 'tailwindcss'

import baseConfig from '@revealed/tailwind-config'

export default {
  content: ['./src/**/*.tsx'],
  presets: [baseConfig],
  theme: {
    extend: {
      colors: {
        ...blackA,
        ...violet,
        ...mauve,
      },
    },
  },
} satisfies Config
