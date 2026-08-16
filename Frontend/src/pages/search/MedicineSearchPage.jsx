/**
 * Component: MedicineSearchPage
 *
 * Description:
 *   Complete medicine search interface for the Smart Medicine
 *   Availability & Intelligent Janaushadhi Recommendation System.
 *
 * Responsibilities:
 *   - Manage shared search query + UI state across sections
 *   - Compose all search page sections in specification order
 *   - Act as a layout orchestrator with minimal business logic
 *   - Render within UserLayout (Sidebar + TopBar provided by layout)
 *
 * Section order (Module 7A complete specification):
 *   1. SearchHeaderSection      — hero title + illustration
 *   2. SearchInputSection       — primary search bar + example pills
 *        └─ SearchSuggestions   — inline below the search bar
 *   3. QuickActionsSection      — 4 quick action cards
 *   4. RecentSearchesSection    — recent search history
 *   5. PopularMedicinesSection  — popular medicine chips
 *   6. MedicineCategoriesSection — category browse grid
 *   7. SearchFiltersSection     — collapsible filter panel
 *   8. SearchLoadingSection     — skeleton placeholders (shown when loading)
 *   9. SearchEmptyState         — no-results UI
 *  10. SearchErrorState         — error / retry UI
 *
 * Route: /search (inside ProtectedRoute → UserLayout)
 *
 * Backend readiness:
 *   - Search      → GET /api/v1/medicines/search?q={query}
 *   - Suggestions → GET /api/v1/medicines/suggest?q={query}
 *   - Popular     → GET /api/v1/medicines/popular
 *   - Recent      → GET /api/v1/users/me/recent-searches
 *   - Categories  → GET /api/v1/medicines/categories
 *   - Filters     → POST /api/v1/medicines/search with filter body
 *   All deferred to Module 7B.
 *
 * Dependencies:
 *   - UserLayout (via React Router nesting — automatic)
 *   - All section components (./sections/*)
 *   - Divider (components/ui)
 */

import { useState, useCallback } from 'react'
import { useNavigate }            from 'react-router-dom'

// ── Sections ──────────────────────────────────────────────────────────────────
import SearchHeaderSection       from './sections/SearchHeaderSection'
import SearchInputSection        from './sections/SearchInputSection'
import SearchSuggestionsSection  from './sections/SearchSuggestionsSection'
import QuickActionsSection       from './sections/QuickActionsSection'
import RecentSearchesSection     from './sections/RecentSearchesSection'
import PopularMedicinesSection   from './sections/PopularMedicinesSection'
import MedicineCategoriesSection from './sections/MedicineCategoriesSection'
import SearchFiltersSection      from './sections/SearchFiltersSection'
import SearchLoadingSection      from './sections/SearchLoadingSection'
import SearchEmptyState          from './sections/SearchEmptyState'
import SearchErrorState          from './sections/SearchErrorState'

import Divider from '../../components/ui/Divider'
import { ROUTES } from '../../constants/routes'

// =====================================================
// Medicine Search Page
// =====================================================
function MedicineSearchPage() {
  const [query,           setQuery]           = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Placeholder UI-state flags for loading / empty / error demos
  // TODO: Module 7B will replace these with actual async states
  // from TanStack Query (isLoading, isError, data.length === 0).
  const [demoState] = useState('idle') // 'idle' | 'loading' | 'empty' | 'error'

  const navigate = useNavigate()

  // ── Shared handlers ──────────────────────────────────────────────────────
  const handleSearch = useCallback((value) => {
    const trimmed = (value ?? query).trim()
    if (!trimmed) return
    setShowSuggestions(false)
    // TODO: Module 7B — navigate to /search/results?q=...
    navigate(`${ROUTES.USER.SEARCH_RESULTS}?q=${encodeURIComponent(trimmed)}`)
  }, [query, navigate])

  const handleQueryChange = useCallback((value) => {
    setQuery(value)
    setShowSuggestions(value.trim().length > 0)
  }, [])

  const handleSuggestionSelect = useCallback((name) => {
    setQuery(name)
    setShowSuggestions(false)
    handleSearch(name)
  }, [handleSearch])

  const handleCloseSuggestions = useCallback(() => {
    setShowSuggestions(false)
  }, [])

  const handleCategorySelect = useCallback((_categoryId) => {
    // TODO: Module 7B — apply category filter to search results
  }, [])

  const handleFiltersApply = useCallback((_filters) => {
    // TODO: Module 7B — pass filter payload to search API
  }, [])

  const handleFiltersReset = useCallback(() => {
    // TODO: Module 7B — clear all active filters
  }, [])

  const handleRetrySearch = useCallback(() => {
    setQuery('')
    setShowSuggestions(false)
    // TODO: Module 7B — re-trigger search or focus input
  }, [])

  return (
    <article aria-label="Medicine Search">

      {/* ===================================================== */}
      {/* Search Header                                         */}
      {/* ===================================================== */}
      <SearchHeaderSection />

      <Divider className="my-0" />

      {/* ===================================================== */}
      {/* Smart Search Interface                                */}
      {/* ===================================================== */}
      <SearchInputSection
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={handleSearch}
      />

      {/* ===================================================== */}
      {/* Search Suggestions (appears when query non-empty)     */}
      {/* ===================================================== */}
      {showSuggestions && (
        <div className="max-w-3xl mx-auto -mt-2 pb-2">
          <SearchSuggestionsSection
            query={query}
            onSelect={handleSuggestionSelect}
            onClose={handleCloseSuggestions}
          />
        </div>
      )}

      <Divider className="mt-2 mb-0" />

      {/* ===================================================== */}
      {/* Quick Actions                                         */}
      {/* ===================================================== */}
      <QuickActionsSection />

      <Divider className="my-0" />

      {/* ===================================================== */}
      {/* Recent Searches                                       */}
      {/* ===================================================== */}
      <RecentSearchesSection onSearch={handleSearch} />

      <Divider className="my-0" />

      {/* ===================================================== */}
      {/* Popular Medicines                                     */}
      {/* ===================================================== */}
      <PopularMedicinesSection onSearch={handleSearch} />

      <Divider className="my-0" />

      {/* ===================================================== */}
      {/* Medicine Categories                                   */}
      {/* ===================================================== */}
      <MedicineCategoriesSection onCategorySelect={handleCategorySelect} />

      <Divider className="my-0" />

      {/* ===================================================== */}
      {/* Search Filters                                        */}
      {/* ===================================================== */}
      <SearchFiltersSection
        onApply={handleFiltersApply}
        onReset={handleFiltersReset}
      />

      {/*
        =====================================================
        Loading / Empty / Error states
        These are rendered conditionally based on the async
        state of the search API in Module 7B.
        Currently shown as demo blocks — replace the
        demoState variable with real TanStack Query state.
        =====================================================
      */}

      {/* ===================================================== */}
      {/* Loading State                                         */}
      {/* Shown when: isLoading === true (Module 7B)            */}
      {/* ===================================================== */}
      {demoState === 'loading' && (
        <>
          <Divider className="my-0" />
          <SearchLoadingSection variant="results" />
        </>
      )}

      {/* ===================================================== */}
      {/* Empty State                                           */}
      {/* Shown when: !isLoading && results.length === 0        */}
      {/* ===================================================== */}
      {demoState === 'empty' && (
        <>
          <Divider className="my-0" />
          <SearchEmptyState query={query} onRetry={handleRetrySearch} />
        </>
      )}

      {/* ===================================================== */}
      {/* Error State                                           */}
      {/* Shown when: isError === true (Module 7B)              */}
      {/* ===================================================== */}
      {demoState === 'error' && (
        <>
          <Divider className="my-0" />
          <SearchErrorState onRetry={handleRetrySearch} />
        </>
      )}

    </article>
  )
}

export default MedicineSearchPage
