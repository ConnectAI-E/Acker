const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      width: {
        'calc-full': 'calc(100% - 0.5rem)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.scrollbar-default': {
          /* IE and Edge */
          '-ms-overflow-style': 'auto',
          /* Firefox */
          'scrollbar-width': 'auto',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'block'
          }
        },
        '.btn': {
          'align-items': 'center',
          'border-color': 'transparent',
          'border-radius': '0.25rem',
          'border-width': '1px',
          'display': 'inline-flex',
          'font-size': '.875rem',
          'line-height': '1.25rem',
          'padding': '0.5rem 0.75rem',
          'pointer-events': 'auto',
        },
        '.text-overflow-l4': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '4',
        },
        '.text-overflow-l2': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.text-overflow-l3': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
        '.text-overflow-l1': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
          'word-break': 'keep-all',
        },
        '.bg-home-dark': {
          background: 'linear-gradient(180deg, rgba(29,31,38,0) 0%, rgba(29,31,38,0.01) 0%, rgba(25,27,33,0.67) 47%, #15171C 100%)'
        },
        '.bg-home-light': {
          background: 'linear-gradient(180deg, rgba(237,240,247,0) 0%, rgba(255,255,255,0) 0%, rgba(250,251,253,0.26) 35%, #EDF0F7 100%)'
        },
        '.user-select-none': {
          '-webkit-user-select': 'none', /* Chrome, Safari, Edge */
          '-moz-user-select': 'none', /* Firefox */
          '-ms-user-select': 'none', /* Internet Explorer */
          'user-select': 'none',
        }
      }, ['responsive'])
    })
  ],
  darkMode: 'class'
};
