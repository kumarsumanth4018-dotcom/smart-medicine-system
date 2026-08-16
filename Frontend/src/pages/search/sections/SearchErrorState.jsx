/**
 * Component: SearchErrorState
 *
 * Purpose:
 *   Displayed when the medicine search API call fails.
 *   Informs the user clearly and provides a retry mechanism.
 *
 * Responsibilities:
 *   - Compose the generic ErrorState component with search-specific content
 *   - Render inline SVG error illustration placeholder
 *   - Provide "Try Again" and "Go Back" action buttons (placeholders)
 *
 * Dependencies:
 *   - ErrorState (components/feedback) — reused, not recreated
 *   - Button     (components/ui)       — reused for actions
 *
 * Props:
 *   onRetry    {Function} — retry the failed search request
 *   errorCode  {string}   — optional technical error code for debugging
 *
 * Backend readiness:
 *   Rendered when GET /api/v1/medicines/search returns a non-2xx
 *   response or when the network request times out. Module 7B wires this.
 *
 * Accessibility:
 *   - role="alert" delegated to ErrorState
 *   - Both action buttons have descriptive aria-labels
 */

import ErrorState from '../../../components/feedback/ErrorState'
import Button     from '../../../components/ui/Button'
import { HiOutlineArrowPath } from 'react-icons/hi2'

// ===========================================
// Error SVG illustration placeholder
// Replace with a real asset without touching the layout.
// ===========================================
function SearchErrorIllustration() {
  return (
    <svg
      viewBox="0 0 120 100"
      className="w-28 h-28"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cloud with exclamation */}
      <path
        d="M86 58c0 8.84-7.16 16-16 16H36c-9.94 0-18-8.06-18-18 0-9.07 6.72-16.57 15.5-17.75A22 22 0 0 1 56 26a22 22 0 0 1 22 22h2c4.42 0 8 3.58 8 8z"
        fill="#fef2f2"
        stroke="#fca5a5"
        strokeWidth="2"
      />
      {/* Exclamation mark */}
      <rect x="57" y="38" width="6" height="16" rx="3" fill="#ef4444" />
      <circle cx="60" cy="62" r="3.5" fill="#ef4444" />
      {/* Decorative lightning */}
      <path d="M96 26 L90 38 L96 38 L90 50" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      <circle cx="20" cy="20" r="2.5" fill="#fee2e2" />
      <circle cx="106" cy="60" r="2" fill="#fee2e2" />
      <circle cx="14" cy="72" r="3"   fill="#fee2e2" />
    </svg>
  )
}

// ===========================================
// Search Error State
// ===========================================
function SearchErrorState({ onRetry, errorCode }) {
  return (
    <div className="py-4">

      {/* ===========================================  */}
      {/* Error State                                 */}
      {/* ===========================================  */}
      <ErrorState
        icon={<SearchErrorIllustration />}
        title="Unable to load medicines"
        description="Something went wrong while searching for medicines. Please check your connection and try again."
        errorCode={errorCode}
        onRetry={onRetry}
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<HiOutlineArrowPath size={15} />}
            onClick={onRetry}
            aria-label="Retry the medicine search"
          >
            Try Again
          </Button>
        }
      />

    </div>
  )
}

export default SearchErrorState
