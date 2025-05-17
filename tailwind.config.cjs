const range = require('lodash/range')

const pxToRem = (px, base = 16) => `${px / base}rem`

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/**/*.{ts,tsx}'],
  safelist: [
    ...range(1, 60 + 1).map((el) => `text-[${el}px]`),
    ...range(1, 12 + 1).map((el) => `grid-cols-${el}`),
    ...range(1, 2 + 1).map((el) => `row-start-${el}`),
    ...range(1, 12 + 1).map((el) => `col-start-${el}`),
    ...range(1, 2 + 1).map((el) => `row-end-${el}`),
    ...range(1, 12 + 1).map((el) => `col-end-${el}`)
  ],
  theme: {
    extend: {
      spacing: {
        ...range(1, 1440 + 1).reduce((acc, px) => {
          acc[`${px}pxr`] = pxToRem(px)
          return acc
        }, {})
      },
      colors: {
        'brand-blue': {
          50: '#92B6FD',
          100: '#6E9EFD',
          200: '#4E88FC',
          300: '#3174FB',
          400: '#1662FA',
          500: '#0554F2',
          600: '#054CDA',
          700: '#0544C4',
          800: '#053DB0',
          900: '#05379E',
          950: '#05318E'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  }
}
