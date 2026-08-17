/**
 * User Service
 *
 * The backend has no separate /users router — the profile of the
 * logged-in user is served by /auth/me (see Backend/app/routers/auth_router.py
 * and app/services/auth_service.py::get_current_user_profile). There is
 * also no PUT/DELETE for the user's own profile yet, and no admin
 * user-listing endpoint — those calls are left as documented TODOs
 * rather than pointed at routes that don't exist.
 *
 * Endpoints (actual backend shape):
 *  GET /auth/me   — full profile: id, full_name, email, phone_number, role, status, is_email_verified
 */

import axiosClient from '../config/axiosClient'

const userService = {
  getMe: () => axiosClient.get('/auth/me'),

  // TODO(backend): no PUT /auth/me yet — add an update-profile endpoint
  // before wiring ProfilePage's edit form to a real call.
  updateMe: () => {
    throw new Error('updateMe is not implemented on the backend yet.')
  },

  // TODO(backend): no admin user-listing endpoints yet.
  getAllUsers: () => {
    throw new Error('getAllUsers is not implemented on the backend yet.')
  },
}

export default userService
