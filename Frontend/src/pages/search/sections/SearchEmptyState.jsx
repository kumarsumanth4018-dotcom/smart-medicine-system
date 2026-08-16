/**
 * Component: SearchEmptyState
 *
 * Purpose:
 *   Displayed when a medicine search returns no results.
 *   Guides the user to try alternative search strategies.
 *
 * Responsibilities:
 *   - Compose the generic EmptyState component with search-specific content
 *   - Render inline SVG illustration placeholder (no-results visual)
 *   - Provide "Search Again" button that clears the query (UI placeholder)
 *
 * Dependencies:
 *   - EmptyState (components/feedback) — reused, not recreated
 *   - Button     (components/ui)       — reused for action
 *
 * Props:
 *   query    {string}   — the query that returned no results
 *   onRetry  {Function} — callback to clear query / refocus search bar
 *
 * Backend readiness:
 *   Rendered when GET /api/v1/medicines/search?q={query} returns
 *   an empty results array. Module 7B will wire this.
 *
 * Accessibility:
 *   - role="status" delegated to EmptyState
 *   - onRetry button has descriptive aria-label
 */

import EmptyState from '../../../components/feedback/EmptyState'
import Button     from '../../../components/ui/Button'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'

// ===========================================
// No-results SVG illustration placeholder
// Replace with a real asset without touching the layout.
// ===========================================
function NoResultsIllustration() {
  return (
    <svg
      viewBox="0 0 120 100"
      className="w-28 h-28 text-slate-200"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Magnifying glass */}
      <circle cx="52" cy="48" r="26" stroke="currentColor" strokeWidth="5" />
      <circle cx="52" cy="48" r="16" fill="#f1f5f9" />
      <line x1="71" y1="67" x2="88" y2="84" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      {/* X inside the glass */}
      <line x1="44" y1="40" x2="60" y2="56" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="40" x2="44" y2="56" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      {/* Decorative dots */}
      <circle cx="20" cy="28" r="3" fill="#e2e8f0" />
      <circle cx="12" cy="44" r="2" fill="#e2e8f0" />
      <circle cx="100" cy="36" r="3" fill="#e2e8f0" />
      <circle cx="108" cy="52" r="2" fill="#e2e8f0" />
    </svg>
  )
}

// ===========================================
// Search Empty State
// ===========================================
function SearchEmptyState({ query = '', onRetry }) {
  return (
    <div className="py-4">

      {/* ===========================================  */}
      {/* Empty State                                 */}
      {/* ===========================================  */}
      <EmptyState
        icon={<NoResultsIllustration />}
        title={query ? `No results for "${query}"` : 'No medicines found'}
        description="Try searching using another medicine name, generic name, or composition. You can also browse by category below."
        size="md"
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<HiOutlineMagnifyingGlass size={15} />}
            onClick={onRetry}
            aria-label="Clear search and try again"
          >
            Search Again
          </Button>
        }
      />

      {/* Contextual tips */}
      <div className="max-w-sm mx-auto mt-4 p-4 rounded-xl bg-primary-50 border border-primary-100">
        <p className="text-xs font-semibold text-primary-700 mb-2">Search tips:</p>
        <ul className="text-xs text-primary-600 space-y-1 list-none">
          <li className="flex items-start gap-1.5">
            <span aria-hidden="true">•</span>
            Try the generic name (e.g., Paracetamol instead of Crocin)
          </li>
          <li className="flex items-start gap-1.5">
            <span aria-hidden="true">•</span>
            Search by active composition (e.g., Amoxicillin 500mg)
          </li>
          <li className="flex items-start gap-1.5">
            <span aria-hidden="true">•</span>
            Check spelling and try shorter search terms
          </li>
          <li className="flex items-start gap-1.5">
            <span aria-hidden="true">•</span>
            Browse categories to find similar medicines
          </li>
        </ul>
      </div>

    </div>
  )
}

export default SearchEmptyState
