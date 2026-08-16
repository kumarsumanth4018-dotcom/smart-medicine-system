/**
 * User Service
 *
 * Handles all user profile API calls.
 * Used by UserContext and user-related components once implemented.
 *
 * Endpoints:
 *  GET    /users/me
 *  PUT    /users/me
 *  DELETE /users/me
 *  GET    /users/:id       (admin only)
 *  GET    /users           (admin only)
 */

import axiosClient from '../config/axiosClient'

const userService = {
  getMe: () => axiosClient.get('/users/me'),

  updateMe: (data) => axiosClient.put('/users/me', data),

  deleteMe: () => axiosClient.delete('/users/me'),

  // Admin operations
  getAllUsers: (params) => axiosClient.get('/users', { params }),

  getUserById: (id) => axiosClient.get(`/users/${id}`),
}

export default userService
