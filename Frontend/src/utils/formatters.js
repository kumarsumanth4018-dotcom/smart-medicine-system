/**
 * Formatters
 *
 * Pure utility functions for formatting data for display.
 * Keeping these here avoids duplicating formatting logic
 * across components.
 */

/**
 * Formats a price value as Indian Rupee currency.
 * @param {number} amount
 * @returns {string}  e.g. "₹ 25.50"
 */
export function formatCurrency(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

/**
 * Formats a date string or Date object to a human-readable format.
 * @param {string|Date} date
 * @returns {string}  e.g. "02 Jul 2025"
 */
export function formatDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Capitalises the first letter of every word in a string.
 * @param {string} str
 * @returns {string}
 */
export function toTitleCase(str) {
  if (!str) return ''
  return str.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  )
}

/**
 * Truncates a string to a maximum length and appends "…".
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength = 100) {
  if (!str) return ''
  return str.length <= maxLength ? str : `${str.slice(0, maxLength)}…`
}
