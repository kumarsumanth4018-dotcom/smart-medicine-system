/**
 * Protected Route
 *
 * Wraps any route that requires the user to be authenticated.
 * If the user is not logged in they are redirected to /login,
 * and the original destination is preserved in location.state
 * so the app can redirect back after a successful login.
 *
 * Optionally accepts an `allowedRoles` prop — if provided, the
 * component also checks whether the current user's role is
 * included in the list, and redirects to /unauthorized otherwise.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
 *     <Route path="/admin/dashboard" element={<AdminDashboard />} />
 *   </Route>
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ROUTES } from '../constants/routes'
import { Spinner } from '../components/feedback'

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, currentUser, isLoading } = useAuth()
  const location = useLocation()

  // Show minimal loading indicator during auth state rehydration
  // Prevents redirect flash on page refresh
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Spinner size="md" color="primary" label="Checking authentication…" />
      </div>
    )
  }

  // Not authenticated — redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  // Role check — redirect to /unauthorized if role not allowed
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
