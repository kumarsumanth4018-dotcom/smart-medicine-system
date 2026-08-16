/**
 * Pagination Component
 *
 * Purpose : Page navigation control for paginated lists.
 * Location : src/components/common/Pagination.jsx
 *
 * Features :
 *   - Previous / Next buttons
 *   - Numbered page buttons with ellipsis for large ranges
 *   - Current page highlighted
 *   - Page count and item count summary
 *   - Disabled states for first/last page
 *   - Keyboard accessible
 *   - ARIA live region for screen readers
 *   - Size variants: sm | md
 *
 * Future usage : Module 4 (search results, medicine list),
 *   Module 5 (inventory table), Module 6 (user table, reports).
 *
 * @param {number}   props.currentPage    — 1-indexed
 * @param {number}   props.totalPages
 * @param {Function} props.onPageChange   — (page: number) => void
 * @param {number}   [props.totalItems]   — optional item count for summary
 * @param {number}   [props.pageSize]
 * @param {'sm'|'md'} [props.size='md']
 * @param {string}   [props.className]
 */

import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

const BTN_BASE =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ' +
  'disabled:opacity-40 disabled:cursor-not-allowed select-none'

const SIZES = {
  sm: { btn: 'w-7 h-7 text-xs', text: 'text-xs' },
  md: { btn: 'w-9 h-9 text-sm', text: 'text-sm' },
}

/** Build visible page numbers with ellipsis */
function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  const addPage = (p) => { if (!pages.includes(p)) pages.push(p) }
  addPage(1)
  if (current > 3) pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) addPage(p)
  if (current < total - 2) pages.push('…')
  addPage(total)
  return pages
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  size = 'md',
  className = '',
}) {
  const s = SIZES[size] ?? SIZES.md
  const pages = buildPages(currentPage, totalPages)

  if (totalPages <= 1) return null

  const rangeStart = pageSize ? (currentPage - 1) * pageSize + 1 : null
  const rangeEnd   = pageSize ? Math.min(currentPage * pageSize, totalItems ?? 0) : null

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}
      aria-label="Pagination"
    >
      {/* Item count summary */}
      {totalItems !== undefined && pageSize && (
        <p className={`${s.text} text-slate-500`} aria-live="polite" aria-atomic="true">
          Showing <span className="font-medium text-slate-700">{rangeStart}–{rangeEnd}</span> of{' '}
          <span className="font-medium text-slate-700">{totalItems}</span> results
        </p>
      )}

      {/* Page buttons */}
      <nav aria-label="Page navigation">
        <ul className="flex items-center gap-1" role="list">
          {/* Previous */}
          <li>
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className={`${BTN_BASE} ${s.btn} border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300`}
            >
              <HiChevronLeft size={14} aria-hidden="true" />
            </button>
          </li>

          {/* Page numbers */}
          {pages.map((page, i) =>
            page === '…' ? (
              <li key={`ellipsis-${i}`} aria-hidden="true">
                <span className={`${s.btn} inline-flex items-center justify-center text-slate-400`}>
                  …
                </span>
              </li>
            ) : (
              <li key={page}>
                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                  className={[
                    BTN_BASE,
                    s.btn,
                    page === currentPage
                      ? 'bg-primary-600 text-white border border-primary-600'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300',
                  ].join(' ')}
                >
                  {page}
                </button>
              </li>
            )
          )}

          {/* Next */}
          <li>
            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className={`${BTN_BASE} ${s.btn} border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300`}
            >
              <HiChevronRight size={14} aria-hidden="true" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Pagination
