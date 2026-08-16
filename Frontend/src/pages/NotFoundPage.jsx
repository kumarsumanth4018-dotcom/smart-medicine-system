/**
 * Component: NotFoundPage (404)
 *
 * Purpose:
 *   Displayed when a user navigates to a route that does not exist.
 *   Provides a professional error illustration, a clear message,
 *   and navigation options back to the application.
 *
 * Responsibilities:
 *   - Display 404 error with healthcare-themed SVG illustration
 *   - Provide Go Home and Go Back navigation options
 *   - Match the application design system (no hardcoded colors)
 *
 * Dependencies:
 *   - React Router Link / useNavigate
 *   - ROUTES constants
 *   - Tailwind design system tokens (primary-*, slate-*)
 */

import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineHome, HiOutlineArrowLeft } from 'react-icons/hi2'
import { ROUTES } from '../constants/routes'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 text-center px-4 bg-slate-50">
      {/* Healthcare-themed 404 SVG */}
      <svg viewBox="0 0 200 160" className="w-48 h-40" fill="none" aria-hidden="true">
        {/* Background circle */}
        <circle cx="100" cy="80" r="70" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2" />
        {/* 404 text */}
        <text x="100" y="90" textAnchor="middle" fontSize="42" fontWeight="800" fill="#2563eb" fontFamily="sans-serif">404</text>
        {/* Medical cross decoration */}
        <rect x="155" y="25" width="8" height="24" rx="3" fill="#bfdbfe" />
        <rect x="149" y="31" width="20" height="12" rx="3" fill="#bfdbfe" />
        {/* Pill decoration */}
        <ellipse cx="40" cy="130" rx="20" ry="9" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
        <line x1="40" y1="121" x2="40" y2="139" stroke="#93c5fd" strokeWidth="1.5" />
        {/* Dots */}
        <circle cx="170" cy="130" r="5" fill="#e0e7ff" />
        <circle cx="182" cy="118" r="3" fill="#c7d2fe" />
        <circle cx="25" cy="40"  r="4" fill="#ccfbf1" />
      </svg>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p className="mt-1 max-w-sm text-sm text-slate-500 leading-relaxed">
          The page you are looking for does not exist or has been moved.
          Please check the URL or navigate back to safety.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <HiOutlineArrowLeft size={15} aria-hidden="true" />
          Go Back
        </button>
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <HiOutlineHome size={15} aria-hidden="true" />
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
