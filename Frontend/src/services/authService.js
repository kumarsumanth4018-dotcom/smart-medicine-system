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

  verifyOtp: (data) => axiosClient.post('/auth/verify-otp', data),

  resendOtp: (data) => axiosClient.post('/auth/resend-otp', data),

  forgotPassword: (data) => axiosClient.post('/auth/forgot-password', data),

  resetPassword: (data) => axiosClient.post('/auth/reset-password', data),

  refreshToken: (data) => axiosClient.post('/auth/refresh-token', data),

  logout: () => axiosClient.post('/auth/logout'),
}

export default authService