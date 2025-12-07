/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // AscendOS Color Palette
      colors: {
        // Primary colors (macOS-inspired)
        ascend: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Surface colors for glassmorphism
        glass: {
          light: 'rgba(255, 255, 255, 0.72)',
          medium: 'rgba(255, 255, 255, 0.56)',
          dark: 'rgba(255, 255, 255, 0.32)',
          border: 'rgba(255, 255, 255, 0.18)',
        },
        // Dark mode glass
        'glass-dark': {
          light: 'rgba(30, 30, 30, 0.72)',
          medium: 'rgba(30, 30, 30, 0.56)',
          dark: 'rgba(30, 30, 30, 0.32)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        // Constraint status colors
        status: {
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#3b82f6',
        },
        // Desktop wallpaper gradient
        desktop: {
          from: '#667eea',
          via: '#764ba2',
          to: '#f093fb',
        },
      },
      // Typography
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Inter',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      // Border radius (macOS-like)
      borderRadius: {
        'os': '10px',       // Default window corners
        'os-lg': '14px',    // Larger windows
        'os-xl': '20px',    // Modal dialogs
        'dock': '16px',     // Dock icons
        'dock-lg': '22px',  // Dock container
      },
      // Shadows (macOS-like depth)
      boxShadow: {
        'os': '0 0 0 1px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.08), 0 8px 30px rgba(0, 0, 0, 0.12)',
        'os-lg': '0 0 0 1px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.12), 0 16px 48px rgba(0, 0, 0, 0.16)',
        'os-focused': '0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 20px rgba(0, 0, 0, 0.16), 0 20px 60px rgba(0, 0, 0, 0.2)',
        'dock': '0 0 0 1px rgba(0, 0, 0, 0.04), 0 4px 20px rgba(0, 0, 0, 0.12)',
        'dock-icon': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'tooltip': '0 2px 8px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
      },
      // Backdrop blur values
      backdropBlur: {
        'os': '20px',
        'os-heavy': '40px',
        'dock': '30px',
      },
      // Animations
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-out': 'fadeOut 0.2s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.15s ease-in',
        'bounce-in': 'bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'dock-bounce': 'dockBounce 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'typing': 'typing 1s steps(3) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        dockBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(14, 165, 233, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.6)' },
        },
        typing: {
          '0%': { opacity: '0.2' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.2' },
        },
      },
      // Spacing for dock
      spacing: {
        'dock': '70px',      // Dock height
        'titlebar': '28px',  // Window title bar height
        'statusbar': '44px', // AscendTrack status bar height
      },
    },
  },
  plugins: [],
}
