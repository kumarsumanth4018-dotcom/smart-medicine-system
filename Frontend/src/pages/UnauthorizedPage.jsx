/**
 * Component: UnauthorizedPage (403)
 *
 * Purpose:
 *   Displayed when an authenticated user attempts to access a route
 *   their role does not permit. Uses design system tokens consistently.
 *
 * Dependencies:
 *   - React Router Link / useNavigate
 *   - ROUTES constants
 *   - Tailwind design system tokens (danger-*, slate-*)
 */

import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineLockClosed, HiOutlineArrowLeft, HiOutlineHome } from 'react-icons/hi2'
import { ROUTES } from '../constants/routes'

function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 text-center px-4 bg-slate-50">
      {/* Lock illustration */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-danger-100 ring-4 ring-danger-50">
        <HiOutlineLockClosed size={36} className="text-danger-500" aria-hidden="true" />
      </div>

      <div>
        <p className="text-6xl font-extrabold text-danger-500">403</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="mt-1 max-w-sm text-sm text-slate-500 leading-relaxed">
          You do not have permission to view this page.
          Please contact your administrator if you believe this is a mistake.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-400"
        >
          <HiOutlineArrowLeft size={15} aria-hidden="true" />
          Go Back
        </button>
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 rounded-xl bg-danger-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-danger-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500 focus-visible:ring-offset-2"
        >
          <HiOutlineHome size={15} aria-hidden="true" />
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default UnauthorizedPage
