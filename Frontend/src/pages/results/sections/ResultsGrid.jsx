/**
 * Component: ResultsGrid
 *
 * Description:
 *   Renders the medicine result cards in either grid or list layout.
 *   Highlights the first card (or the most affordable generic) as
 *   "Best Value". Passes compare/view callbacks to each card.
 *
 * Responsibilities:
 *   - Switch between grid and list layout based on `layout` prop
 *   - Mark the best-value medicine card (index 0 by default)
 *   - Pass compare selection state to each SearchResultCard
 *   - Pass onView navigation callback to each card
 *
 * Props:
 *   medicines       {Array}  — array of medicine objects
 *   layout          {'grid'|'list'}
 *   compareMode     {boolean}
 *   selectedIds     {Set<string>}
 *   onToggleCompare {Function} — (id) => void
 *   onView          {Function} — (id) => void
 *   bestValueId     {string}  — id of the card to highlight
 *
 * Backend readiness:
 *   - medicines → data.results from GET /api/v1/medicines/search
 *   - bestValueId → data.bestValueId from API recommendation field
 *   Both are placeholder in this module.
 */

import SearchResultCard from '../../../components/cards/SearchResultCard'

// ======================================
// Results Grid
// ======================================
function ResultsGrid({
  medicines    = [],
  layout       = 'grid',
  compareMode  = false,
  selectedIds  = new Set(),
  onToggleCompare,
  onView,
  bestValueId,
}) {
  const isListLayout = layout === 'list'

  return (
    <div
      className={
        isListLayout
          ? 'flex flex-col gap-3'
          : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
      }
      role="list"
      aria-label="Medicine search results"
    >
      {medicines.map((medicine) => (
        <div key={medicine.id} role="listitem">
          <SearchResultCard
            medicine={medicine}
            layout={layout}
            isComparing={compareMode}
            isSelected={selectedIds.has(medicine.id)}
            isBestValue={bestValueId
              ? medicine.id === bestValueId
              : medicine.id === medicines[0]?.id
            }
            onCompare={() => onToggleCompare?.(medicine.id)}
            onView={() => onView?.(medicine.id)}
          />
        </div>
      ))}
    </div>
  )
}

export default ResultsGrid
