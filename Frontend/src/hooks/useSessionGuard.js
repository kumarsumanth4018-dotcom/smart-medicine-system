/**
 * useSessionGuard
 *
 * Purpose:
 *   Frontend-only session management placeholder.
 *   Tracks user inactivity and will auto-logout once the backend
 *   is integrated. Currently resets on any mouse/keyboard/touch event.
 *
 * Usage:
 *   Call inside AuthProvider or a top-level component.
 *   useSessionGuard({ timeoutMs: 30 * 60 * 1000, onTimeout: logout })
 *
 * Backend readiness:
 *   - TODO: Wire onTimeout to authService.logout() + redirect to /session-expired
 *   - TODO: Refresh JWT token via POST /api/v1/auth/refresh-token before timeout
 *
 * @param {object} options
 * @param {number}   [options.timeoutMs=1800000]  — 30 minutes default
 * @param {Function} [options.onTimeout]           — called on timeout
 * @param {boolean}  [options.enabled=false]       — disabled until backend is ready
 */

import { useEffect, useRef, useCallback } from 'react'

function useSessionGuard({ timeoutMs = 30 * 60 * 1000, onTimeout, enabled = false } = {}) {
  const timerRef = useRef(null)

  const resetTimer = useCallback(() => {
    if (!enabled) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      // TODO: call authService.logout() then navigate to /session-expired
      onTimeout?.()
    }, timeoutMs)
  }, [enabled, timeoutMs, onTimeout])

  useEffect(() => {
    if (!enabled) return

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }))
    resetTimer()

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer))
      clearTimeout(timerRef.current)
    }
  }, [resetTimer, enabled])
}

export default useSessionGuard
