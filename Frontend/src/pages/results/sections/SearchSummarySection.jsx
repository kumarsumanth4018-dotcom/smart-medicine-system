/**
 * Component: SearchSummarySection
 *
 * Description:
 *   Displays a concise summary of the current search — query,
 *   result count, and search time. Orients the user immediately
 *   after navigating from the search page.
 *
 * Responsibilities:
 *   - Show the active search query with a highlighted style
 *   - Show placeholder result count and search time
 *   - Provide a "Back to search" link
 *   - Show breadcrumb trail
 *
 * Backend readiness:
 *   - resultCount → data.total from GET /api/v1/medicines/search
 *   - searchTime  → X-Response-Time header or client-measured duration
 *   Both are placeholders. Replace in Module 7B Part 2.
 */

import { Link } from 'react-router-dom'
import { HiOutlineArrowLeft, HiOutlineClock } from 'react-icons/hi2'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import { ROUTES } from '../../../constants/routes'

// ======================================
// Search Summary Section
// ======================================
function SearchSummarySection({ query = '', resultCount, searchTime }) {
  // TODO: resultCount from data.total (GET /api/v1/medicines/search)
  const displayCount = resultCount ?? 24
  // TODO: searchTime from response header or client timer
  const displayTime  = searchTime  ?? '0.23'

  return (
    <section aria-labelledby="search-summary-heading" className="pb-4">

      {/* Back link */}
      <Link
        to={ROUTES.USER.SEARCH}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-primary-600 transition-colors mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
        aria-label="Back to medicine search"
      >
        <HiOutlineArrowLeft size={13} aria-hidden="true" />
        Back to Search
      </Link>

      {/* Summary card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">

        {/* Left — query + count */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-100 shrink-0">
            <HiOutlineMagnifyingGlass size={18} className="text-primary-700" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1
              id="search-summary-heading"
              className="text-sm font-semibold text-slate-800"
            >
              Showing{' '}
              <span className="text-primary-700 font-bold">{displayCount} medicines</span>
              {' '}for{' '}
              <span className="italic text-slate-700">&ldquo;{query || 'Paracetamol'}&rdquo;</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <HiOutlineClock size={11} aria-hidden="true" />
              {/* TODO: replace with actual backend search time */}
              Search completed in {displayTime} seconds
            </p>
          </div>
        </div>

        {/* Right — result count badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex flex-col items-center px-4 py-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-lg font-extrabold text-primary-700 leading-none">
              {displayCount}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Results</span>
          </div>
        </div>

      </div>
    </section>
  )
}

export default SearchSummarySection
