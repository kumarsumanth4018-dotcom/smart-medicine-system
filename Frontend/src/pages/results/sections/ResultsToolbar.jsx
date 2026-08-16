/**
 * Component: ResultsToolbar
 *
 * Description:
 *   Sticky toolbar above the results grid providing sort, layout toggle,
 *   filter toggle, compare mode toggle, and result count.
 *
 * Responsibilities:
 *   - Sort by dropdown (price, name, relevance)
 *   - Grid / List layout toggle
 *   - Filter panel toggle button
 *   - Compare mode toggle (enables checkboxes on cards)
 *   - Compare CTA showing selected count (max 4)
 *   - Clear filters button (placeholder)
 *
 * Props:
 *   layout          {'grid'|'list'} — current view mode
 *   onLayoutChange  {Function}
 *   sortBy          {string}
 *   onSortChange    {Function}
 *   compareMode     {boolean}
 *   onCompareToggle {Function}
 *   selectedCount   {number}
 *   onCompareAction {Function}
 *   onFilterToggle  {Function}
 *   filterActive    {boolean}
 *   resultCount     {number}
 *
 * Backend readiness:
 *   - Sort options → sort_by query param on search API (Module 7B Part 2)
 *   - Filter toggle → opens filter panel (already in SearchFiltersSection)
 */

import {
  HiOutlineViewColumns,
  HiOutlineBars3,
  HiOutlineFunnel,
  HiOutlineArrowsRightLeft,
  HiOutlineXMark,
} from 'react-icons/hi2'
import Select from '../../../components/forms/Select'
import Badge  from '../../../components/ui/Badge'

const SORT_OPTIONS = [
  { value: 'relevance',  label: 'Most Relevant'      },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc',   label: 'Name: A–Z'          },
  { value: 'name_desc',  label: 'Name: Z–A'          },
]

const MAX_COMPARE = 4

// ======================================
// Results Toolbar
// ======================================
function ResultsToolbar({
  layout          = 'grid',
  onLayoutChange,
  sortBy          = 'relevance',
  onSortChange,
  compareMode     = false,
  onCompareToggle,
  selectedCount   = 0,
  onCompareAction,
  onFilterToggle,
  filterActive    = false,
  resultCount     = 0,
}) {
  const canCompare = selectedCount >= 2

  return (
    <div
      role="toolbar"
      aria-label="Search results controls"
      className="sticky top-14 z-[150] flex flex-wrap items-center justify-between gap-3 py-3 px-4 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm"
    >
      {/* Left — result count + sort */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </span>

        {/* Sort dropdown — reuses Select component */}
        <div className="w-44">
          <Select
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={(e) => onSortChange?.(e.target.value)}
            aria-label="Sort results by"
          />
        </div>
      </div>

      {/* Right — action buttons */}
      <div className="flex items-center gap-2">

        {/* Filter toggle */}
        <button
          type="button"
          onClick={onFilterToggle}
          aria-label="Toggle filter panel"
          aria-pressed={filterActive}
          className={[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            filterActive
              ? 'border-primary-400 bg-primary-50 text-primary-700'
              : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600',
          ].join(' ')}
        >
          <HiOutlineFunnel size={14} aria-hidden="true" />
          Filters
          {filterActive && <Badge variant="primary" size="sm">On</Badge>}
        </button>

        {/* Compare toggle */}
        <button
          type="button"
          onClick={onCompareToggle}
          aria-label={compareMode ? 'Exit compare mode' : 'Enter compare mode'}
          aria-pressed={compareMode}
          className={[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            compareMode
              ? 'border-primary-400 bg-primary-50 text-primary-700'
              : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600',
          ].join(' ')}
        >
          <HiOutlineArrowsRightLeft size={14} aria-hidden="true" />
          Compare
          {compareMode && selectedCount > 0 && (
            <Badge variant="primary" size="sm">{selectedCount}/{MAX_COMPARE}</Badge>
          )}
        </button>

        {/* Compare action — shown when 2+ selected */}
        {compareMode && selectedCount >= 2 && (
          <button
            type="button"
            onClick={onCompareAction}
            aria-label={`Compare ${selectedCount} selected medicines`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            Compare {selectedCount}
          </button>
        )}

        {/* Grid / List toggle */}
        <div
          className="flex items-center border border-slate-200 rounded-lg overflow-hidden"
          role="group"
          aria-label="View layout"
        >
          <button
            type="button"
            onClick={() => onLayoutChange?.('grid')}
            aria-label="Grid view"
            aria-pressed={layout === 'grid'}
            className={[
              'flex items-center justify-center w-8 h-8 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
              layout === 'grid'
                ? 'bg-primary-600 text-white'
                : 'text-slate-400 hover:text-primary-600 hover:bg-slate-50',
            ].join(' ')}
          >
            <HiOutlineViewColumns size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onLayoutChange?.('list')}
            aria-label="List view"
            aria-pressed={layout === 'list'}
            className={[
              'flex items-center justify-center w-8 h-8 border-l border-slate-200 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
              layout === 'list'
                ? 'bg-primary-600 text-white'
                : 'text-slate-400 hover:text-primary-600 hover:bg-slate-50',
            ].join(' ')}
          >
            <HiOutlineBars3 size={15} aria-hidden="true" />
          </button>
        </div>

        {/* Clear all — shown when compare mode has selections */}
        {compareMode && selectedCount > 0 && (
          <button
            type="button"
            onClick={() => onCompareToggle?.()}
            aria-label="Exit compare mode and clear selections"
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-danger-500 hover:border-danger-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-400"
            title="Exit compare"
          >
            <HiOutlineXMark size={15} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ResultsToolbar
