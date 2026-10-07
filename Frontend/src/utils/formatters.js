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
/**
 * Formats a timestamp as a short relative time string, e.g. "10 min ago".
 * @param {string|Date} timestamp
 * @returns {string}
 */
export function formatTimeAgo(timestamp) {
  if (!timestamp) return ''

  const then = new Date(timestamp)
  const seconds = Math.floor((Date.now() - then.getTime()) / 1000)

  if (seconds < 60) return 'Just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`

  return then.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

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