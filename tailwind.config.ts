import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1', // custom primary
          700: '#4338ca',
          900: '#1e1b4b',
        },
        secondary: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Poppins', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      backgroundColor: {
        container: "hsl(var(--container))",
        "gray-primary": "hsl(var(--gray-primary))",
        "gray-secondary": "hsl(var(--gray-secondary))",
        "gray-tertiary": "hsl(var(--gray-tertiary))",
        "left-panel": "hsl(var(--left-panel))",
        "chat-hover": "hsl(var(--chat-hover))",
        "green-primary": "hsl(var(--green-primary))",
        "green-secondary": "hsl(var(--green-secondary))",
        "green-chat": "hsl(var(--green-chat))",
      },
      backgroundImage: {
        "chat-tile-light": "url('/bg-light.png')",
        "chat-tile-dark": "url('/bg-dark.png')",
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
export default config
