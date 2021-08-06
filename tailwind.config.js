const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  purge: ["./templates/**/*.html", "./theme/**/*.html"],
  theme: {
extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [
      require('@tailwindcss/typography'),
  ],
};
