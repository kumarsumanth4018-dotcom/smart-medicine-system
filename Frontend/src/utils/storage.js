/**
 * Storage Utilities
 *
 * Thin wrappers around localStorage that:
 *  - Serialise / deserialise JSON automatically
 *  - Suppress errors if localStorage is unavailable (e.g. private browsing)
 *  - Provide a typed, consistent API across the codebase
 */

export const storage = {
  get(key) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage quota exceeded or unavailable — silently ignore
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch {
      // Silently ignore
    }
  },

  clear() {
    try {
      localStorage.clear()
    } catch {
      // Silently ignore
    }
  },
}
