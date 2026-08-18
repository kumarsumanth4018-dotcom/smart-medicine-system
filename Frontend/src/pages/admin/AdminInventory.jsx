/**
 * Component: AdminInventory
 *
 * Description:
 *   System-wide inventory monitoring across every Kendra — stock
 *   totals, and drill-down tables for low-stock and out-of-stock items.
 *
 * Backend integration:
 *   GET /api/v1/admin/inventory (Admin only) via adminService.getInventoryOverview()
 *   Aggregates every Kendra's embedded stock[] — no mock data.
 */

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  HiOutlineArchiveBox, HiOutlineCheckCircle,
  HiOutlineExclamationTriangle, HiOutlineXCircle,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import InfoCard from '../../components/cards/InfoCard'
import Badge from '../../components/ui/Badge'
import AdminTable from './components/AdminTable'
import adminService from '../../services/adminService'

const LOW_STOCK_COLUMNS = [
  { key: 'medicine_name', label: 'Medicine', render: (row) => (
      <div className="flex items-center gap-2">
        <MdMedication size={14} className="text-warning-600 shrink-0" aria-hidden="true" />
        <span className="text-xs font-semibold text-slate-900 truncate max-w-[150px]">{row.medicine_name}</span>
      </div>
    ) },
  { key: 'kendra_name', label: 'Kendra', hide: 'md', render: (row) => <span className="text-xs text-slate-500">{row.kendra_name}</span> },
  { key: 'quantity', label: 'Quantity', render: (row) => <span className="text-xs font-bold text-slate-900">{row.quantity}</span> },
  { key: 'status', label: 'Status', render: (row) => (
      <Badge variant={row.status === 'out_of_stock' ? 'danger' : 'warning'} size="sm">
        {row.status === 'out_of_stock' ? 'Out of Stock' : 'Low Stock'}
      </Badge>
    ) },
]

function AdminInventory() {
  const [tab, setTab] = useState('low')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-inventory-overview'],
    queryFn: async () => (await adminService.getInventoryOverview()).data,
  })

  const totals = data?.totals ?? { total_medicines: 0, in_stock: 0, low_stock: 0, out_of_stock: 0 }
  const rows = tab === 'low' ? (data?.low_stock_items ?? []) : (data?.out_of_stock_items ?? [])

  return (
    <article aria-label="Inventory Monitoring" className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Inventory Monitoring</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time stock across every Jan Aushadhi Kendra
        </p>
      </div>

      {isError && (
        <p className="text-sm text-danger-600 bg-danger-50 border border-danger-200 rounded-xl px-4 py-3">
          Couldn't load inventory data.{' '}
          <button type="button" onClick={() => refetch()} className="underline font-medium">Retry</button>
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <InfoCard label="Total Medicines" value={isLoading ? '…' : totals.total_medicines} variant="default" icon={<HiOutlineArchiveBox size={18} />} />
        <InfoCard label="Available"       value={isLoading ? '…' : totals.in_stock}        variant="success" icon={<HiOutlineCheckCircle size={18} />} />
        <InfoCard label="Low Stock"       value={isLoading ? '…' : totals.low_stock}        variant="warning" icon={<HiOutlineExclamationTriangle size={18} />} />
        <InfoCard label="Out of Stock"    value={isLoading ? '…' : totals.out_of_stock}     variant="danger"  icon={<HiOutlineXCircle size={18} />} />
      </div>

      {/* Per-Kendra breakdown */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Stock by Kendra</h2>
        {isLoading && <p className="text-xs text-slate-400">Loading…</p>}
        {!isLoading && (data?.per_kendra ?? []).length === 0 && (
          <p className="text-xs text-slate-400">No Kendras found.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(data?.per_kendra ?? []).map((k) => (
            <div key={k.kendra_id} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <p className="text-xs font-semibold text-slate-900 truncate">{k.kendra_name}</p>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                <span>{k.total_medicines} items</span>
                <span className="text-success-600">{k.in_stock} available</span>
                <span className="text-warning-600">{k.low_stock} low</span>
                <span className="text-danger-600">{k.out_of_stock} out</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low / Out of Stock drill-down */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTab('low')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === 'low' ? 'bg-warning-100 text-warning-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          Low Stock ({totals.low_stock})
        </button>
        <button
          type="button"
          onClick={() => setTab('out')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === 'out' ? 'bg-danger-100 text-danger-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          Out of Stock ({totals.out_of_stock})
        </button>
      </div>

      <AdminTable
        columns={LOW_STOCK_COLUMNS}
        data={rows}
        searchPlaceholder="Search by medicine or Kendra name…"
        ariaLabel="Stock alert table"
      />
    </article>
  )
}

export default AdminInventory