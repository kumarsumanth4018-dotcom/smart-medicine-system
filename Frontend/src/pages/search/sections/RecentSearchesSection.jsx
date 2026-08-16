/**
 * Component: RecentSearchesSection
 *
 * Purpose:
 *   Displays the user's recent search history so they can quickly
 *   repeat a previous search without retyping.
 *
 * Responsibilities:
 *   - Render a list of RecentSearchItem components
 *   - Support per-item removal (remove icon button)
 *   - Support "Clear All" to remove all recent searches at once
 *   - Manage local state for the list (simulated — no persistence)
 *   - Hide the section when the list is empty
 *
 * Dependencies:
 *   - React useState
 *   - React Icons (hi2)
 *   - IconButton (components/ui) — reused, not recreated
 *
 * Backend readiness:
 *   - RECENT_SEARCHES placeholder → GET /api/v1/users/me/recent-searches
 *   - Remove item → DELETE /api/v1/users/me/recent-searches/{id}
 *   - Clear all  → DELETE /api/v1/users/me/recent-searches
 *   All persistence is placeholder. State is local only in this module.
 *
 * Accessibility:
 *   - Each remove button has aria-label identifying the search term
 *   - "Clear all" has role="button" + aria-label
 *   - Section hides via conditional render (not visibility:hidden)
 *     so screen readers are not confused by empty sections
 */

import { useState } from 'react'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineClock,
} from 'react-icons/hi2'

// ======================================
// Placeholder recent searches
// TODO: Replace with GET /api/v1/users/me/recent-searches in Module 7B
// ======================================
const INITIAL_RECENT = [
  { id: 1, query: 'Crocin'       },
  { id: 2, query: 'Paracetamol'  },
  { id: 3, query: 'Vitamin C'    },
  { id: 4, query: 'Amoxicillin'  },
  { id: 5, query: 'Metformin'    },
]

// ======================================
// RecentSearchItem sub-component
// ======================================
function RecentSearchItem({ item, onSelect, onRemove }) {
  return (
    <li className="flex items-center gap-2 group">
      <button
        type="button"
        onClick={() => onSelect(item.query)}
        aria-label={`Search again for ${item.query}`}
        className="flex flex-1 items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-slate-100 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-w-0"
      >
        <HiOutlineClock
          size={14}
          className="text-slate-400 shrink-0"
          aria-hidden="true"
        />
        <span className="text-sm text-slate-700 truncate">{item.query}</span>
        <HiOutlineMagnifyingGlass
          size={12}
          className="text-slate-300 shrink-0 ml-auto group-hover:text-primary-400 transition-colors"
          aria-hidden="true"
        />
      </button>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove "${item.query}" from recent searches`}
        className="flex items-center justify-center w-7 h-7 rounded-md text-slate-300 hover:text-danger-500 hover:bg-danger-50 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-400 shrink-0 opacity-0 group-hover:opacity-100"
      >
        <HiOutlineXMark size={14} aria-hidden="true" />
      </button>
    </li>
  )
}

// ======================================
// Recent Searches Section
// ======================================
function RecentSearchesSection({ onSearch }) {
  // TODO: replace with data from GET /api/v1/users/me/recent-searches
  const [items, setItems] = useState(INITIAL_RECENT)

  function handleRemove(id) {
    // TODO: call DELETE /api/v1/users/me/recent-searches/{id}
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function handleClearAll() {
    // TODO: call DELETE /api/v1/users/me/recent-searches
    setItems([])
  }

  function handleSelect(query) {
    onSearch?.(query)
  }

  // Hide section when no items remain
  if (!items.length) return null

  return (
    <section aria-labelledby="recent-searches-heading" className="py-4">

      {/* ====================================== */}
      {/* Recent Searches Header                 */}
      {/* ====================================== */}
      <div className="flex items-center justify-between mb-3">
        <h2
          id="recent-searches-heading"
          className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"
        >
          <HiOutlineClock size={15} className="text-slate-400" aria-hidden="true" />
          Recent Searches
        </h2>

        {/* Clear All */}
        <button
          type="button"
          onClick={handleClearAll}
          aria-label="Clear all recent searches"
          className="text-xs font-medium text-slate-400 hover:text-danger-500 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-400 rounded"
        >
          Clear all
        </button>
      </div>

      {/* ====================================== */}
      {/* Recent Search Items                    */}
      {/* ====================================== */}
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 gap-1"
        aria-live="polite"
        aria-atomic="false"
      >
        {items.map((item) => (
          <RecentSearchItem
            key={item.id}
            item={item}
            onSelect={handleSelect}
            onRemove={handleRemove}
          />
        ))}
      </ul>

    </section>
  )
}

export default RecentSearchesSection
