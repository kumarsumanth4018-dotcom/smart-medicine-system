/**
 * Theme Context
 *
 * Manages the application colour theme (light / dark).
 * Requirement 3:
 *   - Persists user preference to localStorage
 *   - Respects OS system preference (prefers-color-scheme) on first visit
 *     (before the user has set a manual preference)
 *   - Theme class applied to <html> so Tailwind dark: variants work globally
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { STORAGE_KEYS, THEMES } from '../constants/app'

const ThemeContext = createContext(null)

/**
 * Resolve the initial theme:
 *  1. Use saved localStorage preference if it exists
 *  2. Otherwise fall back to the OS / browser preference
 */
function resolveInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME)
  if (saved === THEMES.DARK || saved === THEMES.LIGHT) return saved
  // Respect system preference on first visit
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEMES.DARK
  }
  return THEMES.LIGHT
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(resolveInitialTheme)

  // Sync theme class on <html> and persist to localStorage whenever theme changes
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(THEMES.LIGHT, THEMES.DARK)
    root.classList.add(theme)
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme((prev) => (prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT))

  const value = {
    theme,
    isDark: theme === THEMES.DARK,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * useTheme — convenience hook for consuming ThemeContext.
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider>')
  }
  return context
}

export default ThemeContext
