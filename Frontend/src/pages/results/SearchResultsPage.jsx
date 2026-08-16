/**
 * Component: SearchResultsPage
 *
 * Description:
 *   Displays medicines matching the user's search query.
 *   The primary interface for discovering medicines, comparing
 *   alternatives, saving favourites, and locating pharmacies.
 *
 * Responsibilities:
 *   - Read search query from URL param (?q=...)
 *   - Manage layout, sort, compare mode, selected medicines state
 *   - Compose SearchSummary, ResultsToolbar, ResultsGrid, CompareBar
 *   - Show loading / empty / error states (reuses existing components)
 *
 * Route: /search/results?q={query}  (inside ProtectedRoute → UserLayout)
 *
 * Backend integration:
 *   Uses TanStack Query against medicineService.search(), which calls
 *   GET /api/v1/medicines/search?q={query}. Results are mapped from the
 *   backend's combined brand+generic shape via mapMedicineToCard().
 *
 * Dependencies:
 *   - SearchSummarySection, ResultsToolbar, ResultsGrid, CompareBar
 *   - SearchEmptyState, SearchErrorState (reused from Module 7A)
 *   - MedicineCardSkeleton (reused from feedback components)
 *   - useSearchParams (React Router v7)
 */

import { useState, useCallback, useMemo } from 'react'
import { useSearchParams, useNavigate }   from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import SearchSummarySection from './sections/SearchSummarySection'
import ResultsToolbar       from './sections/ResultsToolbar'
import ResultsGrid          from './sections/ResultsGrid'
import CompareBar           from './sections/CompareBar'
import SearchEmptyState     from '../search/sections/SearchEmptyState'
import SearchErrorState     from '../search/sections/SearchErrorState'
import SearchLoadingSection from '../search/sections/SearchLoadingSection'
import medicineService, { mapMedicineToCard } from '../../services/medicineService'
import { ROUTES } from '../../constants/routes'

const MAX_COMPARE = 4

// ======================================
// Search Results Page
// ======================================
function SearchResultsPage() {
  const [searchParams]  = useSearchParams()
  const navigate        = useNavigate()
  const query           = searchParams.get('q') ?? ''

  // ── UI state ───────────────────────────────────────────────────────────
  const [layout,      setLayout]      = useState('grid')
  const [sortBy,      setSortBy]      = useState('relevance')
  const [compareMode, setCompareMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [filterOpen,  setFilterOpen]  = useState(false)

  // ── Real search against the backend ──────────────────────────────────
  const {
    data: searchResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['medicines', 'search', query],
    queryFn: async () => {
      const { data } = await medicineService.search({ q: query, page: 1, page_size: 24 })
      return data
    },
    enabled: query.trim().length > 0,
  })

  const medicines = useMemo(
    () => (searchResponse?.results ?? []).map(mapMedicineToCard),
    [searchResponse],
  )

  // ── Sorted medicines ───────────────────────────────────────────────────
  const sortedMedicines = useMemo(() => {
    // TODO: server-side sort in Module 7B Part 2 (sort_by query param)
    const copy = [...medicines]
    if (sortBy === 'price_asc')  copy.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    if (sortBy === 'price_desc') copy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    if (sortBy === 'name_asc')   copy.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'name_desc')  copy.sort((a, b) => b.name.localeCompare(a.name))
    return copy
  }, [medicines, sortBy])

  // ── Compare handlers ───────────────────────────────────────────────────
  const handleToggleCompare = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < MAX_COMPARE) {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleClearCompare  = useCallback(() => { setSelectedIds(new Set()) }, [])
  const handleCompareAction = useCallback(() => {
    // TODO: Module 7B Part 2 — navigate to compare page or open compare modal
  }, [])

  const handleCompareToggle = useCallback(() => {
    setCompareMode((m) => !m)
    if (compareMode) setSelectedIds(new Set())
  }, [compareMode])

  // ── Navigation ─────────────────────────────────────────────────────────
  const handleViewMedicine = useCallback((id) => {
    // TODO: Module 7B Part 2 — navigate to /medicine/:id
    navigate(ROUTES.USER.MEDICINE_DETAIL.replace(':id', id))
  }, [navigate])

  const handleRetrySearch   = useCallback(() => {
    refetch()
  }, [refetch])

  // Selected medicine objects for CompareBar
  const selectedMedicines = sortedMedicines.filter((m) => selectedIds.has(m.id))

  return (
    <article aria-label="Search Results">

      {/* ====================================== */}
      {/* Search Summary                         */}
      {/* ====================================== */}
      <SearchSummarySection
        query={query}
        resultCount={sortedMedicines.length}
      />

      {/* ====================================== */}
      {/* Results Toolbar                        */}
      {/* ====================================== */}
      <ResultsToolbar
        layout={layout}
        onLayoutChange={setLayout}
        sortBy={sortBy}
        onSortChange={setSortBy}
        compareMode={compareMode}
        onCompareToggle={handleCompareToggle}
        selectedCount={selectedIds.size}
        onCompareAction={handleCompareAction}
        onFilterToggle={() => setFilterOpen((o) => !o)}
        filterActive={filterOpen}
        resultCount={sortedMedicines.length}
      />

      {/* ====================================== */}
      {/* Search Results Grid                    */}
      {/* ====================================== */}
      <div className="mt-4">
        {isLoading ? (
          <SearchLoadingSection variant="results" />
        ) : isError ? (
          <SearchErrorState onRetry={handleRetrySearch} />
        ) : sortedMedicines.length > 0 ? (
          <ResultsGrid
            medicines={sortedMedicines}
            layout={layout}
            compareMode={compareMode}
            selectedIds={selectedIds}
            onToggleCompare={handleToggleCompare}
            onView={handleViewMedicine}
          />
        ) : (
          <SearchEmptyState query={query} onRetry={handleRetrySearch} />
        )}
      </div>

      {/*
        ====================================
        Deferred:
          - Pagination / infinite scroll
          - Compare page / modal
          - Filter panel integration (category, price range, etc.)
        ====================================
      */}

      {/* ====================================== */}
      {/* Compare Bar (floating, portal-style)   */}
      {/* ====================================== */}
      {compareMode && (
        <CompareBar
          selectedMedicines={selectedMedicines}
          onRemove={handleToggleCompare}
          onCompare={handleCompareAction}
          onClear={handleClearCompare}
        />
      )}

    </article>
  )
}

export default SearchResultsPage