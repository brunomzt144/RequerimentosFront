/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: 'hsl(var(--primary))',
          'primary-foreground': 'hsl(var(--primary-foreground))',
          secondary: 'hsl(var(--secondary))',
          'secondary-foreground': 'hsl(var(--secondary-foreground))',
          accent: 'hsl(var(--accent))',
          'accent-foreground': 'hsl(var(--accent-foreground))',
          destructive: 'hsl(var(--destructive))',
          'destructive-foreground': 'hsl(var(--destructive-foreground))',
          muted: 'hsl(var(--muted))',
          'muted-foreground': 'hsl(var(--muted-foreground))',
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
          'sidebar-background': 'hsl(var(--sidebar-background))',
          'sidebar-foreground': 'hsl(var(--sidebar-foreground))',
          'sidebar-primary': 'hsl(var(--sidebar-primary))',
          'sidebar-primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          'sidebar-accent': 'hsl(var(--sidebar-accent))',
          'sidebar-accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          'sidebar-border': 'hsl(var(--sidebar-border))',
          'sidebar-ring': 'hsl(var(--sidebar-ring))',
        },
        borderRadius: {
          DEFAULT: 'var(--radius)',
        }
      },
    },
    plugins: [],
  }