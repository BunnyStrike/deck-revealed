// If you want to use other PostCSS plugins, see the following:
// https://tailwindcss.com/docs/using-with-preprocessors

module.exports = require('@revealed/tailwind-config/postcss')

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
