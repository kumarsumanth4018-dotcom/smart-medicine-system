/**
 * Route Constants
 *
 * Centralises every route path string used in the application.
 * Importing from here instead of hardcoding strings prevents typos
 * and makes large-scale refactoring safe and straightforward.
 */

// ─── Public Routes ────────────────────────────────────────────────────────────
export const ROUTES = {
  // Root
  HOME: '/',

  // Authentication
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // General
  NOT_FOUND: '*',
  UNAUTHORIZED: '/unauthorized',
  SESSION_EXPIRED: '/session-expired',

  // ─── Patient / User Routes ───────────────────────────────────────────────
  USER: {
    DASHBOARD: '/dashboard',
    SEARCH: '/search',
    SEARCH_RESULTS: '/search/results',
    MEDICINE_DETAIL: '/medicine/:id',
    GENERIC_RECOMMENDATION: '/medicine/:id/generic',
    NEARBY_PHARMACIES: '/pharmacies/nearby',
    NOTIFICATIONS: '/notifications',
    PROFILE: '/profile',
  },

  // ─── Pharmacy Routes ─────────────────────────────────────────────────────
  PHARMACY: {
    DASHBOARD:      '/pharmacy/dashboard',
    INVENTORY:      '/pharmacy/inventory',
    INVENTORY_ADD:  '/pharmacy/inventory/add',
    INVENTORY_EDIT: '/pharmacy/inventory/edit/:id',
    BILLING:        '/pharmacy/billing',
    PRESCRIPTIONS:  '/pharmacy/prescriptions',
    PROFILE:        '/pharmacy/profile',
  },

  // ─── Admin Routes ────────────────────────────────────────────────────────
  ADMIN: {
    DASHBOARD:    '/admin/dashboard',
    USERS:        '/admin/users',
    PHARMACIES:   '/admin/pharmacies',
    MEDICINES:    '/admin/medicines',
    INVENTORY:    '/admin/inventory',
    EXPIRY:       '/admin/expiry',
    GENERIC_MAP:  '/admin/generic-mapping',
    ANALYTICS:    '/admin/analytics',
    REPORTS:      '/admin/reports',
    NOTIFICATIONS:'/admin/notifications',
    ACTIVITY:     '/admin/activity',
    ROLES:        '/admin/roles',
    SETTINGS:     '/admin/settings',
  },
}