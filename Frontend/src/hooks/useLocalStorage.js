/**
 * useLocalStorage
 *
 * A custom hook that synchronises a state value with localStorage.
 * Works like useState but persists the value across page reloads.
 *
 * @param {string} key          — localStorage key
 * @param {*}      initialValue — default value if nothing is stored
 * @returns {[value, setValue]}
 */

import { useState } from 'react'
import { storage } from '../utils/storage'

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = storage.get(key)
    return item !== null ? item : initialValue
  })

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    storage.set(key, valueToStore)
  }

  return [storedValue, setValue]
}

export default useLocalStorage
