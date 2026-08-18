/**
 * Component: AdminReports
 *
 * Description:
 *   System-wide sales history across every Kendra, with CSV export —
 *   this is the real version of the SRS's "Sales History ... CSV
 *   export for accounting" requirement, admin-scoped (see
 *   pages/pharmacy/SalesHistoryPage.jsx for the per-Kendra version).
 *
 * Backend integration:
 *   GET /api/v1/admin/bills (Admin only) via adminService.getBills()
 *
 * Note: the previous version of this page had PDF/Excel export buttons
 * for various "report types" (user activity, pharmacy performance,
 * etc.) with no real data or export logic behind any of them. Real,
 * working CSV export only exists for actual sales data, so that's
 * what this page does now.
 */

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { HiOutlineArrowDownTray } from 'react-icons/hi2'
import adminService from '../../services/adminService'

function toCsv(bills) {
  const header = ['Bill ID', 'Kendra', 'Date/Time', 'Medicine', 'Quantity', 'Unit Price', 'Line Total']
  const rows = [header.join(',')]
  for (const bill of bills) {
    for (const item of bill.items) {
      rows.push([
        bill.bill_id,
        `"${bill.kendra_name.replace(/"/g, '""')}"`,
        new Date(bill.billed_at).toISOString(),
        `"${item.medicine_name.replace(/"/g, '""')}"`,
        item.quantity,
        item.unit_price,
        item.line_total,
      ].join(','))
    }
  }
  return rows.join('\n')
}

function downloadCsv(bills) {
  const csv = toCsv(bills)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `system-sales-history-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function AdminReports() {
  const [expandedId, setExpandedId] = useState(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-bills', 1],
    queryFn: async () => (await adminService.getBills({ page: 1, page_size: 100 })).data,
  })

  const bills = data?.results ?? []

  return (
    <article aria-label="Sales History" className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Sales History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isLoading ? 'Loading…' : `${data?.total ?? 0} bills across every Kendra`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => downloadCsv(bills)}
          disabled={bills.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <HiOutlineArrowDownTray size={14} aria-hidden="true" /> Export CSV
        </button>
      </div>

      {isError && (
        <p className="text-sm text-danger-600 bg-danger-50 border border-danger-200 rounded-xl px-4 py-3">
          Couldn't load sales history.{' '}
          <button type="button" onClick={() => refetch()} className="underline font-medium">Retry</button>
        </p>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
        {isLoading && <p className="text-sm text-slate-400 text-center py-10">Loading sales history…</p>}
        {!isLoading && bills.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-10">No bills generated yet.</p>
        )}
        {bills.map((bill) => {
          const isOpen = expandedId === bill.bill_id
          return (
            <div key={bill.bill_id}>
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : bill.bill_id)}
                className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {bill.kendra_name} — {bill.items.length} item{bill.items.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-slate-500">{new Date(bill.billed_at).toLocaleString()}</p>
                </div>
                <p className="text-sm font-bold text-slate-900">₹{bill.total_amount}</p>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 flex flex-col gap-1.5">
                  {bill.items.map((item) => (
                    <div key={item.pmbi_code} className="flex items-center justify-between text-xs text-slate-600">
                      <span>{item.medicine_name} × {item.quantity}</span>
                      <span className="font-medium">₹{item.line_total}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default AdminReports