/**
 * Component: SearchHistorySection
 *
 * Description:
 *   Recent search history with re-search quick action and clear history.
 *
 * Backend readiness:
 *   - history → GET /api/v1/users/me/search-history
 *   - clear   → DELETE /api/v1/users/me/search-history
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineMagnifyingGlass, HiOutlineXMark, HiOutlineClock } from 'react-icons/hi2'
import { ROUTES } from '../../../constants/routes'

// TODO: Replace with GET /api/v1/users/me/search-history
const INIT_HISTORY = [
  { id: 'h1', query: 'Paracetamol',  type: 'Medicine Name', date: '2 hours ago'  },
  { id: 'h2', query: 'Azithromycin', type: 'Medicine Name', date: '1 day ago'    },
  { id: 'h3', query: 'Metformin',    type: 'Generic Name',  date: '2 days ago'   },
  { id: 'h4', query: 'Cetirizine',   type: 'Composition',   date: '3 days ago'   },
  { id: 'h5', query: 'Vitamin D3',   type: 'Medicine Name', date: '5 days ago'   },
]

// ======================================================
// Search History
// ======================================================
function SearchHistorySection() {
  const [items, setItems] = useState(INIT_HISTORY)
  const navigate = useNavigate()

  function handleResearch(query) {
    navigate(`${ROUTES.USER.SEARCH_RESULTS}?q=${encodeURIComponent(query)}`)
  }

  return (
    <section aria-labelledby="search-history-heading">
      <div className="flex items-center justify-between mb-3">
        <h2 id="search-history-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HiOutlineClock size={16} className="text-slate-400" aria-hidden="true" />
          Recent Searches
        </h2>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => setItems([])}
            aria-label="Clear all search history"
            className="text-xs text-slate-400 hover:text-danger-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-400 rounded"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <p className="text-center py-8 text-sm text-slate-400">No recent searches.</p>
        ) : (
          <ul aria-label="Search history" className="divide-y divide-slate-50">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-4 py-3 group hover:bg-slate-50 transition-colors">
                <HiOutlineMagnifyingGlass size={14} className="text-slate-300 shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{item.query}</p>
                  <p className="text-[10px] text-slate-400">{item.type} · {item.date}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleResearch(item.query)}
                    aria-label={`Search again for ${item.query}`}
                    className="text-[11px] font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-400"
                  >
                    Search again
                  </button>
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                    aria-label={`Remove ${item.query} from history`}
                    className="text-slate-300 hover:text-danger-400 transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-danger-400"
                  >
                    <HiOutlineXMark size={13} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default SearchHistorySection
