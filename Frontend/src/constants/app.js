/**
 * Application Constants
 *
 * Global constants used throughout the frontend.
 * Centralising them here prevents magic strings and numbers
 * from being scattered across components.
 */

// Application metadata
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Smart Medicine System'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

// User roles — must match the roles returned by the backend
export const USER_ROLES = {
  PATIENT: 'patient',
  PHARMACIST: 'pharmacist',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
}

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'sms_access_token',
  REFRESH_TOKEN: 'sms_refresh_token',
  USER: 'sms_user',
  THEME: 'sms_theme',
}

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50],
}

// Toast notification durations (ms)
export const TOAST = {
  SHORT: 2000,
  DEFAULT: 3000,
  LONG: 5000,
}

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
}

// API response status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}
