/**
 * DemoBanner
 *
 * Displayed at the top of every authenticated layout when the current
 * session is a demo session (currentUser.isDemo === true).
 *
 * ⚠ DEMO / DEVELOPMENT ONLY — this component should be removed or
 *   disabled after real backend authentication is integrated.
 *
 * Features:
 *   - Clearly communicates demo mode to evaluators
 *   - Dismissible for the current session (state only, not persisted)
 *   - Accessible: role="status", keyboard-dismissible
 */

import { useState } from 'react'
import { HiOutlineXMark, HiOutlineBeaker } from 'react-icons/hi2'

function DemoBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-between gap-3 px-4 py-2.5 bg-warning-50 border-b border-warning-200 shrink-0"
    >
      <div className="flex items-center gap-2 min-w-0">
        <HiOutlineBeaker
          size={15}
          className="text-warning-600 shrink-0"
          aria-hidden="true"
        />
        <p className="text-xs font-semibold text-warning-800 truncate">
          🧪 Demo Mode —{' '}
          <span className="font-normal">
            You are viewing sample data for demonstration purposes.
            Backend authentication is not being used.
          </span>
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss demo mode banner"
        className="flex items-center justify-center w-6 h-6 rounded-md text-warning-600 hover:bg-warning-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning-500 shrink-0"
      >
        <HiOutlineXMark size={14} aria-hidden="true" />
      </button>
    </div>
  )
}

export default DemoBanner
