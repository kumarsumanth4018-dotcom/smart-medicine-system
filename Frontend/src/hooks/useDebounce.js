/**
 * useDebounce
 *
 * Delays updating a value until the user has stopped changing it
 * for a given number of milliseconds. Ideal for search inputs so
 * the medicine search API is not called on every keystroke.
 *
 * @param {*}      value — value to debounce (e.g. search query string)
 * @param {number} delay — debounce delay in milliseconds (default 400ms)
 * @returns {*} debounced value
 */

import { useEffect, useState } from 'react'

function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
