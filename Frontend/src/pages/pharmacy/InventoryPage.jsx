/**
 * Component: InventoryPage
 *
 * Description:
 *   Full inventory management page — now backed by real data.
 *   Shows every batch currently stocked at the pharmacy owner's
 *   assigned Kendra (kendra.stock[].batches[]), joined against the
 *   medicine catalog for display names/pricing.
 *
 * Backend:
 *   GET  /api/v1/kendras/:id            — Kendra detail incl. stock/batches
 *   GET  /api/v1/medicines?page_size=…  — catalog lookup (name/price by pmbi_code)
 *   POST /api/v1/kendras/:id/restock    — add a new batch (this page's Restock action)
 */

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  HiOutlinePlus, HiOutlineMagnifyingGlass,
  HiOutlineChevronDown, HiOutlineChevronUp,
  HiOutlineArrowPath, HiOutlineExclamationTriangle,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge    from '../../components/ui/Badge'
import Button   from '../../components/ui/Button'
import Modal    from '../../components/dialogs/Modal'
import { ROUTES } from '../../constants/routes'
import { CATEGORIES, STATUS_CONFIG } from './data/inventoryData'
import { useAuth } from '../../contexts/AuthContext'
import kendraService from '../../services/kendraService'
import medicineService from '../../services/medicineService'

const PAGE_SIZE = 8
const EXPIRING_SOON_DAYS = 60

function daysUntil(dateStr) {
  const diffMs = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

function computeDisplayStatus(quantity, expiryDate) {
  if (quantity <= 0) return 'out'
  if (expiryDate && daysUntil(expiryDate) <= EXPIRING_SOON_DAYS) return 'expiring'
  if (quantity <= 5) return 'low'
  return 'available'
}

function RestockModal({ isOpen, onClose, kendraId, medicines }) {
  const queryClient = useQueryClient()
  const [pmbiCode,    setPmbiCode]    = useState('')
  const [batchNumber, setBatchNumber] = useState('')
  const [expiryDate,  setExpiryDate]  = useState('')
  const [quantity,    setQuantity]    = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: (payload) => kendraService.restock(kendraId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kendra', kendraId] })
      onClose()
      setPmbiCode(''); setBatchNumber(''); setExpiryDate('')
      setQuantity(''); setManufacturer(''); setError('')
    },
    onError: (err) => {
      setError(err?.response?.data?.detail ?? 'Restock failed. Please try again.')
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!pmbiCode || !batchNumber || !expiryDate || !quantity || !manufacturer) {
      setError('All fields are required.')
      return
    }
    mutation.mutate({
      pmbi_code: pmbiCode,
      batch_number: batchNumber,
      expiry_date: new Date(expiryDate).toISOString(),
      quantity: Number(quantity),
      manufacturer,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Stock (Restock)" size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-danger-50 text-danger-700 text-xs">
            <HiOutlineExclamationTriangle size={14} aria-hidden="true" /> {error}
          </div>
        )}

        <label className="text-xs font-semibold text-slate-700">
          Medicine
          <select
            value={pmbiCode}
            onChange={(e) => setPmbiCode(e.target.value)}
            className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary-500"
            required
          >
            <option value="">Select a medicine…</option>
            {medicines.map((m) => (
              <option key={m.pmbi_code} value={m.pmbi_code}>
                {m.brand_name} ({m.pmbi_code})
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold text-slate-700">
          Batch Number
          <input
            type="text" value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)}
            placeholder="e.g. MFG/2026/001"
            className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary-500"
            required
          />
        </label>

        <label className="text-xs font-semibold text-slate-700">
          Expiry Date
          <input
            type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}
            className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary-500"
            required
          />
        </label>

        <label className="text-xs font-semibold text-slate-700">
          Quantity
          <input
            type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary-500"
            required
          />
        </label>

        <label className="text-xs font-semibold text-slate-700">
          Manufacturer (this batch)
          <input
            type="text" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)}
            className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary-500"
            required
          />
        </label>

        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Adding…' : 'Add Stock'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function InventoryPage() {
  const { currentUser } = useAuth()
  const kendraId = currentUser?.assignedKendraId ?? null

  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('')
  const [status,   setStatus]   = useState('')
  const [sortKey,  setSortKey]  = useState('name')
  const [sortDir,  setSortDir]  = useState('asc')
  const [page,     setPage]     = useState(1)
  const [restockOpen, setRestockOpen] = useState(false)

  const kendraQuery = useQuery({
    queryKey: ['kendra', kendraId],
    queryFn: async () => (await kendraService.getById(kendraId)).data,
    enabled: !!kendraId,
  })

  const medicinesQuery = useQuery({
    queryKey: ['medicines', 'all-for-inventory'],
    queryFn: async () => (await medicineService.getAll({ page: 1, page_size: 200 })).data.results,
  })

  const medicineMap = useMemo(() => {
    const map = new Map()
    for (const m of medicinesQuery.data ?? []) map.set(m.pmbi_code, m)
    return map
  }, [medicinesQuery.data])

  // Flatten kendra.stock[].batches[] into one row per batch, joined with
  // the medicine catalog for display name / composition / price.
  const rows = useMemo(() => {
    const stock = kendraQuery.data?.stock ?? []
    const out = []
    for (const item of stock) {
      const med = medicineMap.get(item.pmbi_code)
      const batches = item.batches?.length ? item.batches : [null]
      for (const batch of batches) {
        out.push({
          id: `${item.pmbi_code}-${batch?.batch_number ?? 'none'}`,
          pmbiCode: item.pmbi_code,
          name: med?.brand_name ?? item.pmbi_code,
          genericName: med?.generic_name ?? '',
          composition: med?.composition ?? '',
          category: med?.category ?? '',
          manufacturer: batch?.manufacturer ?? '',
          batch: batch?.batch_number ?? '—',
          expiry: batch?.expiry_date ? new Date(batch.expiry_date).toLocaleDateString() : '—',
          qty: batch?.quantity ?? 0,
          price: med?.jan_aushadhi_mrp ?? 0,
          status: computeDisplayStatus(batch?.quantity ?? 0, batch?.expiry_date),
        })
      }
    }
    return out
  }, [kendraQuery.data, medicineMap])

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const filtered = useMemo(() => {
    let data = [...rows]
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.genericName.toLowerCase().includes(q) ||
        i.composition.toLowerCase().includes(q))
    }
    if (category) data = data.filter(i => i.category === category)
    if (status)   data = data.filter(i => i.status   === status)
    data.sort((a, b) => {
      const va = String(a[sortKey] ?? '').toLowerCase()
      const vb = String(b[sortKey] ?? '').toLowerCase()
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })
    return data
  }, [rows, search, category, status, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function SortIcon({ col }) {
    if (sortKey !== col) return <HiOutlineChevronDown size={12} className="text-slate-300" aria-hidden="true" />
    return sortDir === 'asc'
      ? <HiOutlineChevronUp size={12} className="text-primary-500" aria-hidden="true" />
      : <HiOutlineChevronDown size={12} className="text-primary-500" aria-hidden="true" />
  }

  if (!kendraId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
        <HiOutlineExclamationTriangle size={28} className="text-warning-500" aria-hidden="true" />
        <p className="text-sm font-semibold text-slate-700">No Kendra assigned to your account yet.</p>
        <p className="text-xs text-slate-500 max-w-sm">
          An admin needs to link your account to a Jan Aushadhi Kendra before you can manage inventory.
        </p>
      </div>
    )
  }

  return (
    <article aria-label="Inventory Management" className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Inventory Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {kendraQuery.data?.name ?? 'Loading…'} · {filtered.length} batches · Page {page} of {totalPages}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRestockOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary-600 text-white text-sm font-semibold hover:bg-secondary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
          >
            <HiOutlinePlus size={15} aria-hidden="true" /> Restock
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
          <option value="out">Out of Stock</option>
          <option value="expiring">Expiring Soon</option>
        </select>
      </div>

      {(kendraQuery.isLoading || medicinesQuery.isLoading) && (
        <div className="text-center py-10 text-sm text-slate-400">Loading inventory…</div>
      )}

      {kendraQuery.isError && (
        <div className="text-center py-10 text-sm text-danger-600">
          Couldn't load this Kendra's stock. Try refreshing the page.
        </div>
      )}

      {!kendraQuery.isLoading && !kendraQuery.isError && (
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
                  ].map(col => (
                    <th
                      key={col.key}
                      scope="col"
                      className={col.hide ? `hidden ${col.hide}:table-cell` : ''}
                      onClick={() => toggleSort(col.key)}
                      style={{ cursor: 'pointer' }}
                      aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        <SortIcon col={col.key} />
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
                    </tr>
                  )
                })}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-sm text-slate-400">
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
      )}

      <RestockModal
        isOpen={restockOpen}
        onClose={() => setRestockOpen(false)}
        kendraId={kendraId}
        medicines={medicinesQuery.data ?? []}
      />
    </article>
  )
}

export default InventoryPage