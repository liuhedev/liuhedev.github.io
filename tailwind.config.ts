import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        'paper-deep': 'rgb(var(--paper-deep) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--ink-soft) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        rule: 'rgb(var(--rule) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-soft': 'rgb(var(--accent-soft) / <alpha-value>)',
        highlight: 'rgb(var(--highlight) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-plex)', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        'tracked': '0.14em',
        'tracked-lg': '0.2em',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      typography: ({ theme }: any) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(var(--ink-soft))',
            '--tw-prose-headings': 'rgb(var(--ink))',
            '--tw-prose-links': 'rgb(var(--accent))',
            '--tw-prose-bold': 'rgb(var(--ink))',
            '--tw-prose-quotes': 'rgb(var(--ink-soft))',
            '--tw-prose-quote-borders': 'rgb(var(--accent))',
            '--tw-prose-code': 'rgb(var(--accent))',
            '--tw-prose-hr': 'rgb(var(--rule) / 0.3)',
            fontFamily: 'var(--font-plex), "PingFang SC", "Microsoft YaHei", "Noto Sans SC", system-ui, sans-serif',
            'h1, h2, h3, h4': {
              fontFamily: 'var(--font-fraunces), Georgia, serif',
              fontWeight: '600',
              letterSpacing: '-0.01em',
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
