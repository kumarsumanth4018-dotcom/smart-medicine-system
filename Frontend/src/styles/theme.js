/**
 * Theme Configuration
 *
 * Defines the light and dark theme token maps consumed by ThemeContext.
 * When the user switches themes, ThemeContext applies the `dark` class
 * to <html>, which activates the :root.dark overrides in index.css.
 *
 * This file is the single source of truth for which tokens change
 * between themes — useful for runtime checks and for future
 * theme-aware component logic.
 */

import { THEMES } from '../constants/app'

export const themeConfig = {
  [THEMES.LIGHT]: {
    label: 'Light',
    icon: 'sun',
    bgBase:    '#f8fafc',
    bgSurface: '#ffffff',
    textPrimary: '#0f172a',
  },
  [THEMES.DARK]: {
    label: 'Dark',
    icon: 'moon',
    bgBase:    '#0f172a',
    bgSurface: '#1e293b',
    textPrimary: '#f1f5f9',
  },
}

/**
 * Returns the config object for the given theme key.
 * @param {string} theme — THEMES.LIGHT or THEMES.DARK
 */
export function getThemeConfig(theme) {
  return themeConfig[theme] ?? themeConfig[THEMES.LIGHT]
}
