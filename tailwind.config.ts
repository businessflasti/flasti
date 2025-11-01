import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      display: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      outfit: ['Outfit', 'sans-serif'],
      solitreo: ['Solitreo', 'cursive'],
      segoeText: ['Segoe UI Text', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      segoeDisplay: ['Segoe UI Display Semibold', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
    extend: {
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '0.15', transform: 'scale(1)' },
          '50%': { opacity: '0.25', transform: 'scale(1.1)' },
        },
        'float-particle': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0.4' },
          '50%': { transform: 'translateY(-80px) translateX(40px)', opacity: '0.8' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'progress-pulse': {
          '0%': { transform: 'translateX(-100%)', opacity: '0.5' },
          '50%': { opacity: '0.2' },
          '100%': { transform: 'translateX(100%)', opacity: '0.5' },
        },
        'stake-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'stake-slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'stake-scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'stake-glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(30, 144, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(30, 144, 255, 0.5)' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 5s ease-in-out infinite',
        'float-particle': 'float-particle 10s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'progress-pulse': 'progress-pulse 1.8s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'stake-fade-in': 'stake-fade-in 500ms ease-out',
        'stake-slide-in-left': 'stake-slide-in-left 300ms ease-out',
        'stake-scale-in': 'stake-scale-in 300ms ease-out',
        'stake-glow-pulse': 'stake-glow-pulse 2s ease-in-out infinite',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        // Stake Premium Theme Colors
        stake: {
          bg: {
            primary: '#0F212E',
            secondary: '#1A2C38',
            tertiary: '#213743',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#B1BAD3',
            tertiary: '#7F8EA3',
          },
          accent: {
            primary: '#1E90FF',
            casino: '#00C67A',
            sports: '#1DB4F9',
          },
          status: {
            success: '#00C67A',
            error: '#FF4757',
            warning: '#FFA502',
            info: '#1DB4F9',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'stake-sm': '0.25rem',
        'stake-md': '0.5rem',
        'stake-lg': '0.75rem',
        'stake-xl': '1rem',
        'stake-2xl': '1.5rem',
      },
      boxShadow: {
        'stake-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'stake-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'stake-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'stake-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'stake-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'stake-glow': '0 0 20px rgba(30, 144, 255, 0.3)',
        'stake-glow-casino': '0 0 20px rgba(0, 198, 122, 0.3)',
        'stake-glow-sports': '0 0 20px rgba(29, 180, 249, 0.3)',
      },
      transitionDuration: {
        'stake-fast': '150ms',
        'stake-normal': '300ms',
        'stake-slow': '500ms',
      },
      transitionTimingFunction: {
        'stake-ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'stake-ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'stake-ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        'xs': '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
