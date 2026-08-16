/**
 * Component: SearchLoadingSection
 *
 * Purpose:
 *   Displays animated skeleton placeholders while search results,
 *   categories, or filters are loading from the backend.
 *   Prevents layout shift and improves perceived performance.
 *
 * Responsibilities:
 *   - Render MedicineCardSkeleton grid (reused from feedback)
 *   - Render SearchBarSkeleton (search input placeholder)
 *   - Render CategorySkeleton row (category card placeholders)
 *   - Render FilterSkeleton (filter panel placeholder)
 *
 * Dependencies:
 *   - MedicineCardSkeleton (components/feedback/Skeleton) — reused
 *   - SkeletonLine         (components/feedback/Skeleton) — reused
 *   - No new skeleton logic — only composition
 *
 * Usage:
 *   Show this component while awaiting search API responses.
 *   Replace with actual results once data arrives.
 *   <SearchLoadingSection variant="results" /> — shows medicine cards
 *   <SearchLoadingSection variant="full" />    — shows all skeletons
 *
 * Backend readiness:
 *   Rendered when isLoading=true on the search API call in Module 7B.
 */

import {
  MedicineCardSkeleton,
  SkeletonLine,
} from '../../../components/feedback/Skeleton'

// ===========================================
// Search Bar Skeleton
// ===========================================
function SearchBarSkeleton() {
  return (
    <div className="max-w-3xl mx-auto" aria-hidden="true">
      <SkeletonLine height="h-16" className="rounded-2xl" />
      <div className="flex gap-2 mt-3">
        <SkeletonLine height="h-4" width="w-32" />
        <SkeletonLine height="h-4" width="w-48" className="ml-auto" />
      </div>
      <div className="flex gap-2 mt-3">
        <SkeletonLine height="h-6" width="w-24" className="rounded-full" />
        <SkeletonLine height="h-6" width="w-24" className="rounded-full" />
        <SkeletonLine height="h-6" width="w-24" className="rounded-full" />
      </div>
    </div>
  )
}

// ===========================================
// Category Row Skeleton
// ===========================================
function CategoryRowSkeleton() {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3"
      aria-hidden="true"
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white border border-slate-100"
        >
          <SkeletonLine variant="circle" width="w-12" height="h-12" />
          <SkeletonLine height="h-3.5" width="w-3/4" />
          <SkeletonLine height="h-2.5" width="w-full" />
        </div>
      ))}
    </div>
  )
}

// ===========================================
// Filter Panel Skeleton
// ===========================================
function FilterPanelSkeleton() {
  return (
    <div
      className="bg-white rounded-xl border border-slate-200 p-5 space-y-4"
      aria-hidden="true"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <SkeletonLine height="h-3" width="w-1/2" />
            <SkeletonLine height="h-9" className="rounded-md" />
          </div>
        ))}
      </div>
      <div className="flex gap-4 pt-2 border-t border-slate-100">
        <SkeletonLine height="h-6" width="w-40" />
        <SkeletonLine height="h-6" width="w-40" />
      </div>
    </div>
  )
}

// ===========================================
// Medicine Results Grid Skeleton
// ===========================================
function MedicineResultsSkeleton({ count = 6 }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <MedicineCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ===========================================
// Search Loading Section
// ===========================================
function SearchLoadingSection({ variant = 'results' }) {
  return (
    <div
      role="status"
      aria-label="Loading search content…"
      className="space-y-8 py-4"
    >
      <span className="sr-only">Loading…</span>

      {/* ===========================================  */}
      {/* Loading State — Search Bar                  */}
      {/* ===========================================  */}
      {(variant === 'full' || variant === 'search') && (
        <section aria-label="Loading search bar">
          <SearchBarSkeleton />
        </section>
      )}

      {/* ===========================================  */}
      {/* Loading State — Categories                  */}
      {/* ===========================================  */}
      {(variant === 'full' || variant === 'categories') && (
        <section aria-label="Loading categories">
          <SkeletonLine height="h-5" width="w-40" className="mb-4" />
          <CategoryRowSkeleton />
        </section>
      )}

      {/* ===========================================  */}
      {/* Loading State — Filters                     */}
      {/* ===========================================  */}
      {(variant === 'full' || variant === 'filters') && (
        <section aria-label="Loading filters">
          <SkeletonLine height="h-5" width="w-24" className="mb-3" />
          <FilterPanelSkeleton />
        </section>
      )}

      {/* ===========================================  */}
      {/* Loading State — Medicine Cards              */}
      {/* ===========================================  */}
      {(variant === 'full' || variant === 'results') && (
        <section aria-label="Loading medicines">
          <SkeletonLine height="h-5" width="w-48" className="mb-4" />
          <MedicineResultsSkeleton count={6} />
        </section>
      )}
    </div>
  )
}

export default SearchLoadingSection
