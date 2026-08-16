/**
 * Component: InventoryPage
 *
 * Description:
 *   Full inventory management page with search, filter, sort, pagination,
 *   and complete medicine table.
 *
 * Responsibilities:
 *   • Medicine Inventory Table
 *   • Search by name / generic / composition
 *   • Category and Availability filters
 *   • Sort by column
 *   • Pagination (client-side placeholder)
 *   • Export / Import placeholders
 *   • Add Medicine link
 *
 * Backend readiness:
 *   All operations are frontend-only.
 *   TODO: Replace with GET /api/v1/pharmacy/inventory with query params.
 */

import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlineArrowDownTray,
  HiOutlineArrowUpTray, HiOutlineChevronDown, HiOutlineChevronUp,
  HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineArrowPath,
  HiOutlineFunnel,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge    from '../../components/ui/Badge'
import Button   from '../../components/ui/Button'
import { ROUTES } from '../../constants/routes'
import { INVENTORY, CATEGORIES, STATUS_CONFIG } from './data/inventoryData'

const PAGE_SIZE = 5

function InventoryPage() {
  const navigate = useNavigate()
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('')
  const [status,   setStatus]   = useState('')
  const [sortKey,  setSortKey]  = useState('name')
  const [sortDir,  setSortDir]  = useState('asc')
  const [page,     setPage]     = useState(1)

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const filtered = useMemo(() => {
    let data = [...INVENTORY]
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(i => i.name.toLowerCase().includes(q) || i.genericName.toLowerCase().includes(q) || i.composition.toLowerCase().includes(q))
    }
    if (category) data = data.filter(i => i.category === category)
    if (status)   data = data.filter(i => i.status   === status)
    data.sort((a, b) => {
      const va = String(a[sortKey] ?? '').toLowerCase()
      const vb = String(b[sortKey] ?? '').toLowerCase()
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })
    return data
  }, [search, category, status, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function SortIcon({ col }) {
    if (sortKey !== col) return <HiOutlineChevronDown size={12} className="text-slate-300" aria-hidden="true" />
    return sortDir === 'asc'
      ? <HiOutlineChevronUp size={12} className="text-primary-500" aria-hidden="true" />
      : <HiOutlineChevronDown size={12} className="text-primary-500" aria-hidden="true" />
  }

  return (
    <article aria-label="Inventory Management" className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Inventory Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">{filtered.length} medicines · Page {page} of {totalPages}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`${ROUTES.PHARMACY.INVENTORY}/add`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary-600 text-white text-sm font-semibold hover:bg-secondary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
          >
            <HiOutlinePlus size={15} aria-hidden="true" /> Add Medicine
          </Link>
          <button type="button" aria-label="Import inventory" className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
            <HiOutlineArrowUpTray size={14} aria-hidden="true" /> Import
          </button>
          <button type="button" aria-label="Export inventory" className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
            <HiOutlineArrowDownTray size={14} aria-hidden="true" /> Export
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search medicines by name, generic name or composition…"
            aria-label="Search inventory"
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 placeholder:opacity-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1) }}
          aria-label="Filter by category"
          className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:border-primary-500 outline-none transition"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1) }}
          aria-label="Filter by availability"
          className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:border-primary-500 outline-none transition"
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="low">Low Stock</option>
          <option value="critical">Critical</option>
          <option value="out">Out of Stock</option>
          <option value="expiring">Expiring Soon</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base" role="grid" aria-label="Medicine inventory">
            <thead>
              <tr>
                {[
                  { key: 'name',       label: 'Medicine'      },
                  { key: 'genericName',label: 'Generic',      hide: 'md' },
                  { key: 'manufacturer',label:'Manufacturer', hide: 'lg' },
                  { key: 'batch',      label: 'Batch',        hide: 'xl' },
                  { key: 'expiry',     label: 'Expiry',       hide: 'lg' },
                  { key: 'qty',        label: 'Stock'         },
                  { key: 'price',      label: '₹ Price',      hide: 'md' },
                  { key: 'status',     label: 'Status'        },
                  { key: '_actions',   label: 'Actions'       },
                ].map(col => (
                  <th
                    key={col.key}
                    scope="col"
                    className={col.hide ? `hidden ${col.hide}:table-cell` : ''}
                    onClick={col.key !== '_actions' ? () => toggleSort(col.key) : undefined}
                    style={col.key !== '_actions' ? { cursor: 'pointer' } : {}}
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
              {paged.map(item => {
                const cfg = STATUS_CONFIG[item.status]
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-secondary-50 shrink-0">
                          <MdMedication size={14} className="text-secondary-600" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">{item.name}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{item.composition}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell text-xs text-slate-500">{item.genericName}</td>
                    <td className="hidden lg:table-cell text-xs text-slate-500 truncate max-w-[120px]">{item.manufacturer}</td>
                    <td className="hidden xl:table-cell text-xs text-slate-400 font-mono">{item.batch}</td>
                    <td className={`hidden lg:table-cell text-xs ${item.status === 'expiring' ? 'text-orange-600 font-semibold' : 'text-slate-500'}`}>{item.expiry}</td>
                    <td className="text-xs font-bold text-slate-900">{item.qty}</td>
                    <td className="hidden md:table-cell text-xs text-slate-700">₹{item.price}</td>
                    <td><Badge variant={cfg.variant} size="sm">{cfg.label}</Badge></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button type="button" aria-label={`View ${item.name}`} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500">
                          <HiOutlineEye size={14} aria-hidden="true" />
                        </button>
                        <Link to={`${ROUTES.PHARMACY.INVENTORY}/edit/${item.id}`} aria-label={`Edit ${item.name}`} className="p-1.5 rounded-lg text-slate-400 hover:text-secondary-600 hover:bg-secondary-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary-500">
                          <HiOutlinePencil size={14} aria-hidden="true" />
                        </Link>
                        <button type="button" aria-label={`Restock ${item.name}`} className="p-1.5 rounded-lg text-slate-400 hover:text-success-600 hover:bg-success-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-success-500">
                          <HiOutlineArrowPath size={14} aria-hidden="true" />
                        </button>
                        <button type="button" aria-label={`Delete ${item.name}`} className="p-1.5 rounded-lg text-slate-400 hover:text-danger-500 hover:bg-danger-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-danger-400">
                          <HiOutlineTrash size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-sm text-slate-400">
                    No medicines match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500">
            Showing {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} aria-label="Previous page" className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
              ← Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i+1)}
                aria-label={`Page ${i+1}`}
                aria-current={page === i+1 ? 'page' : undefined}
                className={`w-8 h-7 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${page === i+1 ? 'bg-primary-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              >
                {i+1}
              </button>
            ))}
            <button type="button" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} aria-label="Next page" className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
              Next →
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default InventoryPage
