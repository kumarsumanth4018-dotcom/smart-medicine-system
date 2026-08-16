/**
 * Component: OfflinePage
 *
 * Description: Offline / Network Error page.
 * Displayed when the user loses internet connectivity.
 * The useOnlineStatus hook triggers this via the AppErrorBoundary.
 */

import { HiOutlineWifi, HiOutlineArrowPath } from 'react-icons/hi2'

function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-warning-100">
        <HiOutlineWifi size={36} className="text-warning-500" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-800">You're offline</h1>
        <p className="text-sm text-slate-500 max-w-sm mt-1 leading-relaxed">
          Please check your internet connection and try again. Some features may not be available while offline.
        </p>
      </div>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-warning-500 text-white text-sm font-semibold hover:bg-warning-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning-500"
      >
        <HiOutlineArrowPath size={15} aria-hidden="true" />
        Retry Connection
      </button>
    </div>
  )
}

export default OfflinePage
