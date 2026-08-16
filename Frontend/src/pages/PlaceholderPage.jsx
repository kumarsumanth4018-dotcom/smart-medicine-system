/**
 * Component: PlaceholderPage
 *
 * Purpose:
 *   Temporary stand-in for routes not yet fully implemented.
 *   Uses design system tokens — no hardcoded colors.
 *   Will be progressively replaced by real page components.
 *
 * Note: Only used by pharmacy/prescriptions at this point (Module 11).
 * All other routes have real page implementations.
 */

import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2'

function PlaceholderPage({ title = 'Page' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center px-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-50">
        <HiOutlineWrenchScrewdriver size={26} className="text-primary-400" aria-hidden="true" />
      </div>
      <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 uppercase tracking-wide">
        Coming Soon
      </span>
      <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      <p className="text-sm text-slate-400 max-w-xs">
        This page is under development and will be available in a future release.
      </p>
    </div>
  )
}

export default PlaceholderPage
