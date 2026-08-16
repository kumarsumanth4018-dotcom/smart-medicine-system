/**
 * Component: SessionExpiredPage
 *
 * Description:
 *   Session timeout / expired page. Shown when the user's session
 *   has expired and they need to log in again.
 *
 * Backend readiness:
 *   - TODO: Triggered by 401 response interceptor in axiosClient.js
 *   - TODO: Auto-redirect after JWT token expiry
 */

import { Link } from 'react-router-dom'
import { HiOutlineLockClosed, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { ROUTES } from '../../constants/routes'

function SessionExpiredPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-warning-100">
        <HiOutlineLockClosed size={36} className="text-warning-500" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-800">Session Expired</h1>
        <p className="text-sm text-slate-500 max-w-sm mt-1 leading-relaxed">
          Your session has expired for security reasons. Please log in again to continue.
        </p>
        <p className="text-[11px] text-slate-400 mt-2">
          {/* TODO: triggered by 401 from axiosClient response interceptor */}
          Session management will be active once backend is integrated.
        </p>
      </div>
      <Link
        to={ROUTES.LOGIN}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <HiOutlineArrowRightOnRectangle size={15} aria-hidden="true" />
        Log In Again
      </Link>
    </div>
  )
}

export default SessionExpiredPage
