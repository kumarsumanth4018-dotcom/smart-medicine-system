/**
 * Axios Client Configuration
 *
 * Purpose:
 *   Creates and exports a pre-configured Axios instance used by all
 *   service layer modules. Centralises base URL, headers, timeouts,
 *   and interceptors in a single place.
 *
 * Responsibilities:
 *   - Attach JWT Bearer token to every outgoing request
 *   - Handle 401 Unauthorized globally (redirect to /session-expired)
 *   - Propagate all other errors to the calling service
 *
 * Dependencies:
 *   - env.js (API_BASE_URL)
 *   - constants/app.js (STORAGE_KEYS)
 *   - utils/storage.js (localStorage wrapper)
 *
 * Future Backend Notes:
 *   - Replace the 401 redirect with a token refresh flow:
 *       1. Attempt POST /api/v1/auth/refresh-token with REFRESH_TOKEN
 *       2. On success: update ACCESS_TOKEN, retry original request
 *       3. On failure: clear session and redirect to ROUTES.SESSION_EXPIRED
 *   - Add request timeout retry logic for network flakiness
 *   - Add request ID header (X-Request-ID) for distributed tracing
 */

import axios from 'axios'
import env           from './env'
import { STORAGE_KEYS } from '../constants/app'
import { ROUTES }    from '../constants/routes'
import { storage }   from '../utils/storage'

// ── Create Axios instance ─────────────────────────────────────────────────────
const axiosClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds — prevents indefinitely hanging requests
})

// ── Request Interceptor ───────────────────────────────────────────────────────
// Attaches the JWT access token from localStorage to every request.
// When the backend is integrated, the token will be set here automatically.
axiosClient.interceptors.request.use(
  (config) => {
    const token = storage.get(STORAGE_KEYS.ACCESS_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response Interceptor ──────────────────────────────────────────────────────
// Handles global error responses before they reach individual services.
// 401 Unauthorized → clear session + redirect to /session-expired.
// All other errors are propagated to the calling service unchanged.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored session tokens
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN)
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
      storage.remove(STORAGE_KEYS.USER)

      // Redirect to session-expired page (avoids circular import of React Router)
      // Only redirect if not already on an auth page to prevent redirect loops
      const isAuthPage = ['/login', '/register', ROUTES.SESSION_EXPIRED].some(
        (path) => window.location.pathname.startsWith(path),
      )
      if (!isAuthPage) {
        window.location.href = ROUTES.SESSION_EXPIRED
      }
    }
    return Promise.reject(error)
  },
)

export default axiosClient
