/**
 * Authentication Context
 *
 * Provides authentication state and all auth actions to the component tree.
 * Frontend state management is fully implemented here.
 * Actual API calls are delegated to authService — when the backend is
 * ready, only authService needs to be updated; this context stays intact.
 *
 * State:
 *   currentUser     — the authenticated user object (or null)
 *   isAuthenticated — boolean derived from currentUser
 *   isLoading       — true while an async auth action is in progress
 *   authError       — last auth error message (or null)
 *
 * Actions:
 *   login()          — stores user + tokens, sets currentUser
 *   register()       — initiates registration flow, navigates to OTP page
 *   verifyOtp()      — verifies OTP code
 *   resendOtp()      — re-sends OTP
 *   forgotPassword() — sends OTP to email
 *   resetPassword()  — resets password with token
 *   logout()         — clears tokens + user state
 *   clearError()     — resets authError
 *
 * Token storage uses the storage utility (localStorage wrapper).
 */

import { createContext, useContext, useState, useCallback } from 'react'
import { storage } from '../utils/storage'
import { STORAGE_KEYS } from '../constants/app'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(() => storage.get(STORAGE_KEYS.USER))
  const [isLoading,   setIsLoading]     = useState(false)
  const [authError,   setAuthError]     = useState(null)

  // ── Helpers ──────────────────────────────────────────────────────────────
  const clearError = useCallback(() => setAuthError(null), [])

  function storeSession(user, accessToken, refreshToken) {
    storage.set(STORAGE_KEYS.USER,          user)
    storage.set(STORAGE_KEYS.ACCESS_TOKEN,  accessToken)
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    setCurrentUser(user)
  }

  function clearSession() {
    storage.remove(STORAGE_KEYS.USER)
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN)
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
    setCurrentUser(null)
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  /**
   * Login — calls authService.login(credentials).
   * On success stores session and returns the user object.
   * On failure stores the error message and re-throws so the
   * page form can display it.
   */
  // Backend roles are UPPERCASE (USER/ADMIN/PHARMACY); the rest of the
  // frontend expects lowercase role strings (see USER_ROLES in constants/app.js).
  // This is the one place that translates between the two.
  const BACKEND_ROLE_MAP = {
    USER: 'patient',
    ADMIN: 'admin',
    PHARMACY: 'pharmacist',
  }

  const login = useCallback(async (credentials) => {
    setIsLoading(true)
    setAuthError(null)
    try {
      const { data } = await authService.login({
        email: credentials.email,
        password: credentials.password,
      })

      // Backend only returns a token on login — fetch the full profile
      // separately using that token (axiosClient attaches it automatically
      // once it's stored, so we store the token first).
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, data.access_token)

      const { data: profile } = await authService.getMe()

      const user = {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        phone: profile.phone_number,
        role: BACKEND_ROLE_MAP[profile.role] ?? 'patient',
        assignedKendraId: profile.assigned_kendra_id ?? null,
      }

      storeSession(user, data.access_token, null)
      return user
    } catch (err) {
      // Clean up the token if the profile fetch failed after a successful login
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN)
      const msg = err?.response?.data?.detail ?? 'Login failed. Please try again.'
      setAuthError(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * loginAsDemo — Instantly authenticates a pre-defined demo account.
   *
   * ⚠ DEMO / DEVELOPMENT ONLY — Demo authentication is intended only for
   *   development and project demonstrations. Remove or disable this feature
   *   after backend authentication is integrated.
   *   Must be removed or disabled before production deployment.
   *   Replace with real authService.login() when the FastAPI backend is ready.
   *
   * The user object is tagged with isDemo: true so layouts can
   * display the demo mode banner.
   *
   * @param {'patient'|'pharmacist'|'admin'} role
   * @returns {object} user — the demo user object
   */
  const loginAsDemo = useCallback((role) => {
    const DEMO_ACCOUNTS = {
      patient: {
        user:         { id: 'demo-1', name: 'Demo User',           email: 'demo.user@smartmedicine.com',     role: 'patient',    isDemo: true },
        accessToken:  'demo_access_token_user',
        refreshToken: 'demo_refresh_token_user',
      },
      pharmacist: {
        user:         { id: 'demo-2', name: 'Demo Pharmacy Owner', email: 'demo.pharmacy@smartmedicine.com', role: 'pharmacist', isDemo: true },
        accessToken:  'demo_access_token_pharmacy',
        refreshToken: 'demo_refresh_token_pharmacy',
      },
      admin: {
        user:         { id: 'demo-3', name: 'Demo Administrator',  email: 'admin@smartmedicine.com',         role: 'admin',      isDemo: true },
        accessToken:  'demo_access_token_admin',
        refreshToken: 'demo_refresh_token_admin',
      },
    }
    const data = DEMO_ACCOUNTS[role] ?? DEMO_ACCOUNTS.patient
    storeSession(data.user, data.accessToken, data.refreshToken)
    return data.user
  }, [])

  /**
   * Register — calls authService.register(payload).
   * Returns the email so the OTP page can display it.
   */
  const register = useCallback(async (payload) => {
  setIsLoading(true)
  setAuthError(null)

  try {
    const { data } = await authService.register({
      full_name: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone_number: payload.mobile.trim(),
      password: payload.password,
    })

    return {
      email: data.email || payload.email.trim().toLowerCase(),
      message: data.message,
    }
  } catch (err) {
    const message =
      err?.response?.data?.detail ||
      'Registration failed. Please try again.'

    setAuthError(message)
    throw err
  } finally {
    setIsLoading(false)
  }
}, [])
  /**
   * Verify OTP — validates the 6-digit code.
   */
  const verifyOtp = useCallback(async (payload) => {
  setIsLoading(true)
  setAuthError(null)

  try {
    const { data } = await authService.verifyOtp({
      email: payload.email.trim().toLowerCase(),
      otp: payload.otp,
    })

    return data
  } catch (err) {
    const message =
      err?.response?.data?.detail ||
      'OTP verification failed. Please try again.'

    setAuthError(message)
    throw err
  } finally {
    setIsLoading(false)
  }
}, [])

  /**
   * Resend OTP
   */
  const resendOtp = useCallback(async (payload) => {
  setIsLoading(true)
  setAuthError(null)

  try {
    const { data } = await authService.resendOtp({
      email: payload.email.trim().toLowerCase(),
    })

    return data
  } catch (err) {
    const message =
      err?.response?.data?.detail ||
      'Failed to resend OTP. Please try again.'

    setAuthError(message)
    throw err
  } finally {
    setIsLoading(false)
  }
}, [])

  /**
   * Forgot Password — sends OTP to the provided email.
   */
  const forgotPassword = useCallback(async (payload) => {
    setIsLoading(true)
    setAuthError(null)
    try {
      await authService.forgotPassword(payload)
      return { email: payload.email }
    } catch (err) {
      const msg = err?.response?.data?.detail ?? 'Failed to send reset OTP.'
      setAuthError(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Reset Password
   */
  const resetPassword = useCallback(async (payload) => {
    setIsLoading(true)
    setAuthError(null)
    try {
      await authService.resetPassword({
        email: payload.email,
        otp: payload.otp,
        new_password: payload.password,
      })
      return true
    } catch (err) {
      const msg = err?.response?.data?.detail ?? 'Failed to reset password.'
      setAuthError(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Logout — clears session and user state.
   */
  const logout = useCallback(() => {
    clearSession()
  }, [])

  // ── Context value ─────────────────────────────────────────────────────────
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isDemo: !!currentUser?.isDemo,   // true when active session is a demo session
    isLoading,
    authError,
    clearError,
    login,
    loginAsDemo,
    register,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an <AuthProvider>')
  return context
}

export default AuthContext