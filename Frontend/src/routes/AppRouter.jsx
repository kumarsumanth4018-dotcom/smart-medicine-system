/**
 * Component: ApplicationRouter
 *
 * Description:
 *   Integrates the complete frontend workflow including navigation,
 *   layouts, protected routes, authentication flow, dashboards,
 *   and application level providers.
 *
 * Responsibilities:
 *   - Complete route tree for all user roles
 *   - Layout integration (MainLayout / AuthLayout / UserLayout / PharmacyLayout / AdminLayout)
 *   - Role-based protected route guards
 *   - Public route guards (redirect authenticated users away from auth pages)
 *   - 404 and 403 error pages
 *   - Future API route placeholder comments
 *
 * Complete Workflow:
 *   Home → Login/Register → OTP → User Dashboard → Medicine Search
 *   → Search Results → Medicine Details → Generic Recommendation
 *   → Nearby Pharmacies → Interactive Map → User Dashboard
 *   → Notifications → Profile → Logout
 *
 * Route Tree:
 *   /                                MainLayout
 *
 *   /login /register etc             AuthLayout  (PublicRoute guard)
 *
 *   /dashboard /search …             UserLayout  (ProtectedRoute: patient / doctor)
 *
 *   /pharmacy/dashboard …            PharmacyLayout (ProtectedRoute: pharmacist)
 *
 *   /admin/dashboard …               AdminLayout (ProtectedRoute: admin)
 *
 *   /unauthorized                    Standalone
 *   /session-expired                 Standalone
 *   *                                NotFoundPage
 *
 * Backend readiness:
 *   // TODO: Add API route placeholders at the bottom for future FastAPI integration
 */

import { lazy, Suspense } from 'react'
import { Routes, Route }  from 'react-router-dom'

// ── Layouts ───────────────────────────────────────────────────────────────────
import MainLayout     from '../layouts/MainLayout'
import AuthLayout     from '../layouts/AuthLayout'
import UserLayout     from '../layouts/UserLayout'
import PharmacyLayout from '../layouts/PharmacyLayout'
import AdminLayout    from '../layouts/AdminLayout'

// ── Route guards ──────────────────────────────────────────────────────────────
import PublicRoute    from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'
import { USER_ROLES } from '../constants/app'

// ── Global loading fallback ───────────────────────────────────────────────────
import { Spinner } from '../components/feedback'

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="md" color="primary" label="Loading page…" />
    </div>
  )
}

// =====================================================
// Authentication Pages — eagerly loaded (small, critical path)
// =====================================================
import LoginPage          from '../pages/auth/LoginPage'
import RegisterPage       from '../pages/auth/RegisterPage'
import VerifyOtpPage      from '../pages/auth/VerifyOtpPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage  from '../pages/auth/ResetPasswordPage'
import AdminLoginPage     from '../pages/auth/AdminLoginPage'

// =====================================================
// Error Pages — eagerly loaded (needed for boundary fallbacks)
// =====================================================
import NotFoundPage       from '../pages/NotFoundPage'
import UnauthorizedPage   from '../pages/UnauthorizedPage'
import SessionExpiredPage from '../pages/errors/SessionExpiredPage'

// =====================================================
// Public Pages — lazy loaded (heavy sections, below-the-fold)
// =====================================================
const HomePage = lazy(() => import('../pages/home/HomePage'))

// =====================================================
// User Pages — lazy loaded
// =====================================================
const UserDashboard           = lazy(() => import('../pages/dashboard/UserDashboard'))
const MedicineSearchPage      = lazy(() => import('../pages/search/MedicineSearchPage'))
const SearchResultsPage       = lazy(() => import('../pages/results/SearchResultsPage'))
const MedicineDetailsPage     = lazy(() => import('../pages/medicine/MedicineDetailsPage'))
const GenericRecommendationPage = lazy(() => import('../pages/generic/GenericRecommendationPage'))
const NearbyPharmaciesPage    = lazy(() => import('../pages/pharmacies/NearbyPharmaciesPage'))
const NotificationsPage       = lazy(() => import('../pages/notifications/NotificationsPage'))
const ProfilePage             = lazy(() => import('../pages/profile/ProfilePage'))

// =====================================================
// Pharmacy Pages — lazy loaded
// =====================================================
const PharmacyDashboard = lazy(() => import('../pages/pharmacy/PharmacyDashboard'))
const InventoryPage     = lazy(() => import('../pages/pharmacy/InventoryPage'))
const BillingPage       = lazy(() => import('../pages/pharmacy/BillingPage'))
const MedicineFormPage  = lazy(() => import('../pages/pharmacy/MedicineFormPage'))

// =====================================================
// Admin Pages — lazy loaded
// =====================================================
const AdminDashboard      = lazy(() => import('../pages/admin/AdminDashboard'))
const AdminUsers          = lazy(() => import('../pages/admin/AdminUsers'))
const AdminPharmacies     = lazy(() => import('../pages/admin/AdminPharmacies'))
const AdminMedicines      = lazy(() => import('../pages/admin/AdminMedicines'))
const AdminInventory      = lazy(() => import('../pages/admin/AdminInventory'))
const AdminExpiry         = lazy(() => import('../pages/admin/AdminExpiry'))
const AdminGenericMapping = lazy(() => import('../pages/admin/AdminGenericMapping'))
const AdminAnalytics      = lazy(() => import('../pages/admin/AdminAnalytics'))
const AdminReports        = lazy(() => import('../pages/admin/AdminReports'))
const AdminNotifications  = lazy(() => import('../pages/admin/AdminNotifications'))
const AdminActivity       = lazy(() => import('../pages/admin/AdminActivity'))
const AdminRoles          = lazy(() => import('../pages/admin/AdminRoles'))
const AdminSettings       = lazy(() => import('../pages/admin/AdminSettings'))

// =====================================================
// Application Router
// =====================================================
function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* =====================================================
            Public / Landing
            ===================================================== */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* =====================================================
            Protected Routes — Authentication
            PublicRoute: redirects authenticated users to their dashboard
            ===================================================== */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="login"           element={<LoginPage />} />
            <Route path="register"        element={<RegisterPage />} />
            <Route path="verify-otp"      element={<VerifyOtpPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password"  element={<ResetPasswordPage />} />
          </Route>
        </Route>

        {/* =====================================================
            Layout Integration — User / Patient Routes
            ProtectedRoute: patient | doctor roles
            ===================================================== */}
        <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.PATIENT, USER_ROLES.DOCTOR]} />}>
          <Route element={<UserLayout />}>
            {/* Dashboard */}
            <Route path="dashboard"               element={<UserDashboard />} />
            {/* Medicine Search flow */}
            <Route path="search"                  element={<MedicineSearchPage />} />
            <Route path="search/results"          element={<SearchResultsPage />} />
            <Route path="medicine/:id"            element={<MedicineDetailsPage />} />
            <Route path="medicine/:id/generic"    element={<GenericRecommendationPage />} />
            {/* Pharmacy Map flow */}
            <Route path="pharmacies/nearby"       element={<NearbyPharmaciesPage />} />
            {/* Account */}
            <Route path="notifications"           element={<NotificationsPage />} />
            <Route path="profile"                 element={<ProfilePage />} />
          </Route>
        </Route>

        {/* =====================================================
            Layout Integration — Pharmacy Staff Routes
            ProtectedRoute: pharmacist role
            ===================================================== */}
        <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.PHARMACIST]} />}>
          <Route element={<PharmacyLayout />}>
            <Route path="pharmacy/dashboard"          element={<PharmacyDashboard />} />
            <Route path="pharmacy/inventory"          element={<InventoryPage />} />
            <Route path="pharmacy/inventory/add"      element={<MedicineFormPage />} />
            <Route path="pharmacy/inventory/edit/:id" element={<MedicineFormPage />} />
            <Route path="pharmacy/billing"            element={<BillingPage />} />
            {/* TODO: prescriptions page in future module */}
            <Route path="pharmacy/prescriptions"      element={<InventoryPage />} />
            {/* TODO: pharmacy profile page in future module */}
            <Route path="pharmacy/profile"            element={<ProfilePage />} />
          </Route>
        </Route>

        {/* =====================================================
            Layout Integration — Admin Routes
            ProtectedRoute: admin role
            ===================================================== */}
        <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route path="admin/dashboard"         element={<AdminDashboard />} />
            <Route path="admin/users"             element={<AdminUsers />} />
            <Route path="admin/pharmacies"        element={<AdminPharmacies />} />
            <Route path="admin/medicines"         element={<AdminMedicines />} />
            <Route path="admin/inventory"         element={<AdminInventory />} />
            <Route path="admin/expiry"            element={<AdminExpiry />} />
            <Route path="admin/generic-mapping"   element={<AdminGenericMapping />} />
            <Route path="admin/analytics"         element={<AdminAnalytics />} />
            <Route path="admin/reports"           element={<AdminReports />} />
            <Route path="admin/notifications"     element={<AdminNotifications />} />
            <Route path="admin/activity"          element={<AdminActivity />} />
            <Route path="admin/roles"             element={<AdminRoles />} />
            <Route path="admin/settings"          element={<AdminSettings />} />
          </Route>
        </Route>

        {/* =====================================================
            Global Error Pages
            ===================================================== */}
        <Route path="unauthorized"    element={<UnauthorizedPage />} />
        <Route path="session-expired" element={<SessionExpiredPage />} />

        {/* =====================================================
            Administrator Portal Login
            Standalone page — NOT inside PublicRoute or AuthLayout.
            NOT linked from homepage or public /login.
            Accessible only via direct navigation to /admin/login.
            ===================================================== */}
        <Route path="admin/login" element={<AdminLoginPage />} />

        <Route path="*"               element={<NotFoundPage />} />

        {/*
          =====================================================
          Future Backend Ready — API Route Placeholders
          =====================================================
          TODO: /api/v1/medicines/search        → medicineService.search()
          TODO: /api/v1/medicines/:id           → medicineService.getById()
          TODO: /api/v1/medicines/alternatives  → medicineService.getAlternatives()
          TODO: /api/v1/pharmacies/nearby       → kendraService.findNearby() [implemented]
          TODO: /api/v1/auth/login              → authService.login()
          TODO: /api/v1/auth/register           → authService.register()
          TODO: /api/v1/auth/verify-otp         → authService.verifyOtp()
          TODO: /api/v1/users/me                → userService.getMe()
          TODO: /api/v1/users/me/notifications  → userService notifications
          TODO: /api/v1/pharmacy/inventory      → kendraService.getById() + restock()/generateBill() [implemented]
          TODO: /api/v1/admin/*                 → admin portal APIs
          =====================================================
        */}

      </Routes>
    </Suspense>
  )
}

export default AppRouter