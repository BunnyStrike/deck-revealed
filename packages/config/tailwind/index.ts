import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/frontend/**/*.{js,ts,jsx,tsx}',
    //
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
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
