/**
 * Component: AdminTable
 *
 * Description:
 *   Reusable searchable, sortable, paginated table for admin management pages.
 *   Accepts columns config + data array — renders a professional enterprise table.
 *
 * Props:
 *   columns  — [{ key, label, hide?, render? }]
 *   data     — array of row objects
 *   searchPlaceholder — string
 *   filters  — optional React node for extra filter controls
 *   actions  — React node for header action buttons
 *   ariaLabel— string for table aria-label
 */

import { useState, useMemo } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineChevronUp, HiOutlineChevronDown } from 'react-icons/hi2'

const PAGE_SIZE = 6

function AdminTable({ columns = [], data = [], searchPlaceholder = 'Search…', filters, actions, ariaLabel = 'Table' }) {
  const [search,  setSearch]  = useState('')
  const [sortKey, setSortKey] = useState('')
  const [sortDir, setSortDir] = useState('asc')
  const [page,    setPage]    = useState(1)

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const filtered = useMemo(() => {
    let d = [...data]
    if (search.trim()) {
      const q = search.toLowerCase()
      d = d.filter(row => columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(q)))
    }
    if (sortKey) {
      d.sort((a, b) => {
        const va = String(a[sortKey] ?? '').toLowerCase()
        const vb = String(b[sortKey] ?? '').toLowerCase()
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      })
    }
    return d
  }, [data, search, sortKey, sortDir, columns])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  function SortIcon({ col }) {
    if (sortKey !== col) return <HiOutlineChevronDown size={11} className="text-slate-300" aria-hidden="true" />
    return sortDir === 'asc'
      ? <HiOutlineChevronUp   size={11} className="text-primary-500" aria-hidden="true" />
      : <HiOutlineChevronDown size={11} className="text-primary-500" aria-hidden="true" />
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
          <input
            type="search" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 placeholder:opacity-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
        {filters}
        {actions}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base" role="grid" aria-label={ariaLabel}>
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key} scope="col"
                    className={[col.hide ? `hidden ${col.hide}:table-cell` : '', col.key !== '_actions' ? 'cursor-pointer select-none' : ''].join(' ')}
                    onClick={col.key !== '_actions' ? () => toggleSort(col.key) : undefined}
                    aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.key !== '_actions' && <SortIcon col={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((row, ri) => (
                <tr key={row.id ?? ri}>
                  {columns.map(col => (
                    <td key={col.key} className={col.hide ? `hidden ${col.hide}:table-cell` : ''}>
                      {col.render ? col.render(row) : <span className="text-xs text-slate-700">{String(row[col.key] ?? '—')}</span>}
                    </td>
                  ))}
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={columns.length} className="text-center py-10 text-sm text-slate-400">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500">{filtered.length} records · Page {page} of {totalPages}</p>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} aria-label="Previous page"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
              ←
            </button>
            {Array.from({length: totalPages}).map((_,i) => (
              <button key={i} type="button" onClick={() => setPage(i+1)} aria-label={`Page ${i+1}`} aria-current={page===i+1?'page':undefined}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${page===i+1 ? 'bg-primary-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                {i+1}
              </button>
            ))}
            <button type="button" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} aria-label="Next page"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminTable
