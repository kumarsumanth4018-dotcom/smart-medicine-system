/**
 * useGeolocation
 *
 * Wraps the browser Geolocation API. Falls back to a default location
 * (Mysuru city center, matching our seeded Kendra data) if the user
 * denies permission, the browser doesn't support it, or it times out —
 * so the page still shows something useful instead of a dead end.
 */
import { useState, useEffect } from 'react'

const FALLBACK_LOCATION = { lat: 12.3052, lng: 76.6551 } // Mysuru city center

export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [status, setStatus] = useState('locating') // 'locating' | 'granted' | 'fallback'

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocation(FALLBACK_LOCATION)
      setStatus('fallback')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus('granted')
      },
      () => {
        setLocation(FALLBACK_LOCATION)
        setStatus('fallback')
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    )
  }, [])

  return { location, status }
}