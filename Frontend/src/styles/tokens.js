/**
 * Design Tokens (JavaScript)
 *
 * Mirrors the CSS custom properties defined in index.css so that
 * React components that need token values programmatically (e.g.
 * chart colours, inline styles, dynamic classNames) can import
 * them from here instead of hard-coding hex values.
 *
 * Rule: if you need a colour or size in a JSX file, import from
 * here — never write raw hex or pixel values in component code.
 */

export const colors = {
  // Primary — Medical Blue
  primary: {
    50:  '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Secondary — Teal
  secondary: {
    50:  '#f0fdfa',
    100: '#ccfbf1',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
  },
  // Semantic
  success: { 50: '#f0fdf4', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
  warning: { 50: '#fffbeb', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' },
  danger:  { 50: '#fff1f2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
  info:    { 50: '#eff6ff', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
  // Text
  text: {
    primary:   '#0f172a',
    secondary: '#475569',
    muted:     '#94a3b8',
    disabled:  '#cbd5e1',
    inverse:   '#ffffff',
    link:      '#2563eb',
  },
  // Surface
  bg: {
    base:     '#f8fafc',
    surface:  '#ffffff',
    elevated: '#f1f5f9',
  },
  // Border
  border: {
    default: '#e2e8f0',
    strong:  '#cbd5e1',
    focus:   '#3b82f6',
  },
}

export const typography = {
  fonts: {
    sans: "'Inter', ui-sans-serif, system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
  },
  sizes: {
    display:  '3rem',
    h1:       '2.25rem',
    h2:       '1.875rem',
    h3:       '1.5rem',
    h4:       '1.25rem',
    subtitle: '1.125rem',
    body:     '1rem',
    sm:       '0.875rem',
    xs:       '0.75rem',
    caption:  '0.6875rem',
  },
  weights: {
    regular:   400,
    medium:    500,
    semibold:  600,
    bold:      700,
    extrabold: 800,
  },
}

export const spacing = {
  sectionY:  '5rem',
  sectionSm: '3rem',
  card:      '1.5rem',
  cardSm:    '1rem',
  input:     '0.75rem',
  gutter:    '1.5rem',
}

export const radius = {
  none: '0',
  sm:   '0.25rem',
  md:   '0.5rem',
  lg:   '0.75rem',
  xl:   '1rem',
  '2xl':'1.5rem',
  full: '9999px',
}

export const shadows = {
  xs:        '0 1px 2px 0 rgba(0,0,0,0.05)',
  sm:        '0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)',
  md:        '0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)',
  lg:        '0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)',
  card:      '0 2px 8px 0 rgba(15,23,42,0.08)',
  cardHover: '0 8px 24px 0 rgba(15,23,42,0.12)',
  focus:     '0 0 0 3px rgba(59,130,246,0.35)',
}

export const transitions = {
  fast:   '150ms ease',
  base:   '200ms ease',
  slow:   '300ms ease',
}

export const breakpoints = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  '2xl': 1536,
}

export const zIndex = {
  dropdown: 100,
  sticky:   200,
  overlay:  300,
  modal:    400,
  toast:    500,
  tooltip:  600,
}
