/**
 * Component: ServerErrorPage
 *
 * Description: 500 Internal Server Error page.
 * Displayed when the application encounters an unexpected runtime error.
 */

import { Link } from 'react-router-dom'
import { HiOutlineArrowPath, HiOutlineHome } from 'react-icons/hi2'
import { ROUTES } from '../../constants/routes'

function ServerErrorPage({ onRetry }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      {/* SVG illustration */}
      <svg viewBox="0 0 120 100" className="w-32 h-32" fill="none" aria-hidden="true">
        <circle cx="60" cy="50" r="40" fill="#fff1f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="60" y="58" textAnchor="middle" fontSize="28" fontWeight="800" fill="#ef4444" fontFamily="sans-serif">500</text>
        <path d="M40 30 L80 30" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />
        <path d="M35 75 L85 75" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <div>
        <p className="text-5xl font-extrabold text-danger-500">500</p>
        <h1 className="text-xl font-bold text-slate-800 mt-2">Internal Server Error</h1>
        <p className="text-sm text-slate-500 max-w-sm mt-1 leading-relaxed">
          Something went wrong on our end. Our team has been notified. Please try again.
        </p>
      </div>

      <div className="flex items-center gap-3 mt-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-danger-600 text-white text-sm font-medium hover:bg-danger-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
          >
            <HiOutlineArrowPath size={15} aria-hidden="true" />
            Try Again
          </button>
        )}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <HiOutlineHome size={15} aria-hidden="true" />
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default ServerErrorPage
