const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.emerald[500],
          hover: colors.emerald[600],
          active: colors.emerald[700],
        },
        secondary: {
          DEFAULT: colors.blue[500],
          hover: colors.blue[600],
          active: colors.blue[700],
        },
        neutral: {
          DEFAULT: colors.gray[300],
          hover: colors.gray[400],
          active: colors.emerald[700],
        },
      },
    },
  },
  plugins: [],
};
