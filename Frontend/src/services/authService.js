/**
 * Auth Service
 *
 * All authentication-related API calls go through this module.
 * Components and hooks never call axiosClient directly — they
 * call a named function from a service so the API contract is
 * encapsulated in one place.
 *
 * Endpoints (to be implemented in Module 2):
 *  POST /auth/register
 *  POST /auth/login
 *  POST /auth/verify-otp
 *  POST /auth/resend-otp
 *  POST /auth/forgot-password
 *  POST /auth/reset-password
 *  POST /auth/refresh-token
 *  POST /auth/logout
 */

import axiosClient from '../config/axiosClient'

const authService = {
  register: (data) => axiosClient.post('/auth/register', data),

  login: (credentials) => axiosClient.post('/auth/login', credentials),

  getMe: () => axiosClient.get('/auth/me'),

  // Backend takes `flow` as a query param and {email, otp} as the body
  verifyOtp: ({ email, otp, flow = 'register' }) =>
    axiosClient.post(`/auth/verify-otp?flow=${encodeURIComponent(flow)}`, { email, otp }),

  // Backend takes email as a query param, no body
  resendOtp: ({ email }) =>
    axiosClient.post(`/auth/resend-otp?email=${encodeURIComponent(email)}`),

  forgotPassword: (data) => axiosClient.post('/auth/forgot-password', data),

  resetPassword: (data) => axiosClient.post('/auth/reset-password', data),

  refreshToken: (data) => axiosClient.post('/auth/refresh-token', data),

  logout: () => axiosClient.post('/auth/logout'),
}

export default authService