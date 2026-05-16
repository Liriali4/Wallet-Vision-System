module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg:       '#F5EBE6',
          surface:  '#EAD5C9',
          text:     '#3D312A',
          muted:    '#8C7365',
          positive: '#A3B19B',
          negative: '#D98A74',
          border:   '#D9C4B8',
          // dark variants
          'dark-bg':      '#1C1612',
          'dark-surface': '#2A211B',
          'dark-border':  '#3D312A',
          'dark-text':    '#F0E6DF',
          'dark-muted':   '#8C7365',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'card':  '0 1px 3px 0 rgba(61,49,42,0.06), 0 1px 2px -1px rgba(61,49,42,0.04)',
        'card-md': '0 4px 12px 0 rgba(61,49,42,0.08)',
        'card-lg': '0 8px 24px 0 rgba(61,49,42,0.10)',
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '80': '20rem',
      }
    },
  },
  plugins: [],
}
