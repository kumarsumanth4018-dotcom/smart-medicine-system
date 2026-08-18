/**
 * Component: AdminExpiry
 *
 * Description:
 *   System-wide expiry monitoring across every Kendra, matching the
 *   SRS thresholds: amber (<=60 days), red (<=30 days), expired.
 *
 * Backend integration:
 *   GET /api/v1/admin/expiry (Admin only) via adminService.getExpiryOverview()
 *   Computed from every batch's real expiry_date across all Kendras —
 *   no mock data.
 */

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { HiOutlineClock, HiOutlineFire, HiOutlineExclamationTriangle } from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import InfoCard from '../../components/cards/InfoCard'
import Badge from '../../components/ui/Badge'
import AdminTable from './components/AdminTable'
import adminService from '../../services/adminService'

const TABS = [
  { key: 'expired', label: 'Expired',        variant: 'neutral' },
  { key: 'red',     label: 'Red (≤30 days)', variant: 'danger'  },
  { key: 'amber',   label: 'Amber (≤60 days)', variant: 'warning' },
]

const COLUMNS = [
  { key: 'medicine_name', label: 'Medicine', render: (row) => (
      <div className="flex items-center gap-2">
        <MdMedication size={14} className="text-slate-500 shrink-0" aria-hidden="true" />
        <span className="text-xs font-semibold text-slate-900 truncate max-w-[150px]">{row.medicine_name}</span>
      </div>
    ) },
  { key: 'kendra_name', label: 'Kendra', hide: 'md', render: (row) => <span className="text-xs text-slate-500">{row.kendra_name}</span> },
  { key: 'batch_number', label: 'Batch', hide: 'lg', render: (row) => <span className="text-xs text-slate-400 font-mono">{row.batch_number}</span> },
  { key: 'quantity', label: 'Quantity', render: (row) => <span className="text-xs font-bold text-slate-900">{row.quantity}</span> },
  { key: 'days_left', label: 'Expiry', render: (row) => (
      <span className="text-xs text-slate-700">
        {new Date(row.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        {' '}
        <span className={row.days_left < 0 ? 'text-slate-400' : row.days_left <= 30 ? 'text-danger-600' : 'text-warning-600'}>
          ({row.days_left < 0 ? `${Math.abs(row.days_left)}d ago` : `${row.days_left}d left`})
        </span>
      </span>
    ) },
]

function AdminExpiry() {
  const [tab, setTab] = useState('red')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-expiry-overview'],
    queryFn: async () => (await adminService.getExpiryOverview()).data,
  })

  const summary = data?.summary ?? { expired_count: 0, red_count: 0, amber_count: 0 }
  const rows = data?.[tab] ?? []

  return (
    <article aria-label="Expiry Monitoring" className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Expiry Monitoring</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Batch expiry status across every Jan Aushadhi Kendra
        </p>
      </div>

      {isError && (
        <p className="text-sm text-danger-600 bg-danger-50 border border-danger-200 rounded-xl px-4 py-3">
          Couldn't load expiry data.{' '}
          <button type="button" onClick={() => refetch()} className="underline font-medium">Retry</button>
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <InfoCard label="Expired Batches"      value={isLoading ? '…' : summary.expired_count} variant="default" icon={<HiOutlineClock size={18} />} />
        <InfoCard label="Red — ≤30 days"       value={isLoading ? '…' : summary.red_count}      variant="danger"  icon={<HiOutlineFire size={18} />} />
        <InfoCard label="Amber — ≤60 days"     value={isLoading ? '…' : summary.amber_count}    variant="warning" icon={<HiOutlineExclamationTriangle size={18} />} />
      </div>

      <div className="flex items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              tab === t.key
                ? t.variant === 'danger' ? 'bg-danger-100 text-danger-800'
                  : t.variant === 'warning' ? 'bg-warning-100 text-warning-800'
                  : 'bg-slate-200 text-slate-700'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {t.label} ({summary[`${t.key}_count`] ?? 0})
          </button>
        ))}
      </div>

      <AdminTable
        columns={COLUMNS}
        data={rows}
        searchPlaceholder="Search by medicine, Kendra or batch number…"
        ariaLabel="Expiry alert table"
      />

      <p className="text-[11px] text-slate-400">
        Note: the SRS specifies expired batches should be hidden from customer
        search results — that filtering isn't implemented on the customer-facing
        side yet. This page just surfaces the same expiry data for admin awareness.
      </p>
    </article>
  )
}

export default AdminExpiry