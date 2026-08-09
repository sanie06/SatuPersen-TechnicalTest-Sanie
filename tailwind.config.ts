import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

// Nuxt UI v2 maps `primary` to a Tailwind color name (see app.config.ts), so the
// brand yellow is declared here as a full shade ramp rather than a single hex.
export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fdf08a',
          300: '#fce047',
          400: '#f9cd1a',
          500: '#f5c518', // PRD primary
          600: '#d4a406',
          700: '#a97c08',
          800: '#8b620f',
          900: '#765013',
          950: '#452b06',
        },
        ink: {
          // PRD dark backgrounds
          900: '#16213e',
          950: '#0d0d1a',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Slow drift for floating overlays. Anything using it must not carry a
        // transform of its own — the animation owns that property outright.
        float: {
          '0%, 100%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        float: 'float 3.5s ease-in-out infinite',
      },
    },
  },
}
