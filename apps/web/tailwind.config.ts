// import { blackA, mauve, violet } from '@radix-ui/colors'
import type { Config } from 'tailwindcss'
import * as defaultTheme from 'tailwindcss/defaultTheme'

import baseConfig from '@revealed/tailwind-config'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.tsx'],
  presets: [baseConfig],
  theme: {
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '2rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['2rem', { lineHeight: '3rem' }],
      '4xl': ['2.5rem', { lineHeight: '3rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    extend: {
      animation: {
        'fade-in': 'fade-in 0.5s linear forwards',
        marquee: 'marquee var(--marquee-duration) linear infinite',
        'spin-slow': 'spin 4s linear infinite',
        'spin-slower': 'spin 6s linear infinite',
        'spin-reverse': 'spin-reverse 1s linear infinite',
        'spin-reverse-slow': 'spin-reverse 4s linear infinite',
        'spin-reverse-slower': 'spin-reverse 6s linear infinite',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      colors: ({ colors }) => ({
        gray: colors.neutral,
      }),
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        'fade-in': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        marquee: {
          '100%': {
            transform: 'translateY(-50%)',
          },
        },
        'spin-reverse': {
          to: {
            transform: 'rotate(-360deg)',
          },
        },
      },
      maxWidth: {
        '2xl': '40rem',
      },
    },
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
