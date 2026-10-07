import axios from 'axios'

import env from './env'
import { STORAGE_KEYS } from '../constants/app'
import { ROUTES } from '../constants/routes'
import { storage } from '../utils/storage'


// =====================================================
// Axios instance
// =====================================================

const axiosClient = axios.create({
  baseURL: env.API_BASE_URL,

  headers: {
    'Content-Type': 'application/json',
  },

  timeout: 30000,
})


// =====================================================
// Request interceptor
// =====================================================

axiosClient.interceptors.request.use(
  config => {
    const token = storage.get(
      STORAGE_KEYS.ACCESS_TOKEN,
    )

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`
    }

    return config
  },

  error => Promise.reject(error),
)


// =====================================================
// Response interceptor
// =====================================================

axiosClient.interceptors.response.use(
  response => response,

  error => {
    const status =
      error.response?.status

    const token = storage.get(
      STORAGE_KEYS.ACCESS_TOKEN,
    )

    /*
     * Demo accounts use local fake tokens. The backend
     * cannot validate these tokens, so a 401 response
     * must not log the demo user out.
     */
    const isDemoToken =
      typeof token === 'string'
      && token.startsWith(
        'demo_access_token',
      )

    if (
      status === 401
      && !isDemoToken
    ) {
      storage.remove(
        STORAGE_KEYS.ACCESS_TOKEN,
      )

      storage.remove(
        STORAGE_KEYS.REFRESH_TOKEN,
      )

      storage.remove(
        STORAGE_KEYS.USER,
      )

      const currentPath =
        window.location.pathname

      const isAuthenticationPage = [
        '/login',
        '/register',
        ROUTES.SESSION_EXPIRED,
      ].some(path =>
        currentPath.startsWith(path),
      )

      if (!isAuthenticationPage) {
        window.location.href =
          ROUTES.SESSION_EXPIRED
      }
    }

    return Promise.reject(error)
  },
)


export default axiosClient