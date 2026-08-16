/**
 * Public Route
 *
 * Wraps auth pages (Login, Register, etc.) so that already-authenticated
 * users are redirected away from them.
 * If an authenticated user tries to visit /login they are sent to
 * their role-appropriate dashboard instead.
 *
 * Usage:
 *   <Route element={<PublicRoute />}>
 *     <Route path="/login" element={<LoginPage />} />
 *   </Route>
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ROUTES } from '../constants/routes'
import { USER_ROLES } from '../constants/app'
import { Spinner } from '../components/feedback'

function PublicRoute() {
  const { isAuthenticated, currentUser, isLoading } = useAuth()

  // Show loading indicator during auth rehydration — prevents flash redirect
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Spinner size="md" color="primary" label="Loading…" />
      </div>
    )
  }

  if (isAuthenticated) {
    // Redirect to role-appropriate dashboard
    switch (currentUser?.role) {
      case USER_ROLES.ADMIN:
        return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />
      case USER_ROLES.PHARMACIST:
        return <Navigate to={ROUTES.PHARMACY.DASHBOARD} replace />
      default:
        return <Navigate to={ROUTES.USER.DASHBOARD} replace />
    }
  }

  return <Outlet />
}

export default PublicRoute
