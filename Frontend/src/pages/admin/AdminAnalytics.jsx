/**
 * Component: AdminAnalytics
 *
 * Description:
 *   System-wide demand analytics from real bill data — revenue
 *   summary, top-selling medicines, and a daily sales trend.
 *
 * Backend integration:
 *   GET /api/v1/admin/analytics (Admin only) via adminService.getDemandAnalytics()
 *
 * Note on scope: the SRS's "Demand Analytics" spec also mentions "most
 * searched medicines" and "users waiting for a medicine" — those aren't
 * shown here because the backend doesn't track search queries or stock
 * alert subscriptions yet, so there's no real data to aggregate. This
 * page only shows what's genuinely backed by data: sales-derived
 * analytics from the `bills` collection.
 */

import { useQuery } from '@tanstack/react-query'
import { HiOutlineCurrencyRupee, HiOutlineShoppingCart, HiOutlineChartBar } from 'react-icons/hi2'
import { MdAnalytics, MdMedication } from 'react-icons/md'
import InfoCard from '../../components/cards/InfoCard'
import adminService from '../../services/adminService'

// Dependency-free bar chart — no charting library is installed in this project.
function TrendBarChart({ data = [] }) {
  const max = Math.max(1, ...data.map((d) => d.revenue))
  return (
    <div className="flex items-end gap-1 h-40 px-2">
      {data.map((d) => (
        <div key={d.date} className="flex-1 flex flex-col items-center justify-end gap-1 group relative">
          <div
            className="w-full rounded-t bg-primary-400 group-hover:bg-primary-600 transition-colors"
            style={{ height: `${Math.max(2, (d.revenue / max) * 100)}%` }}
            title={`${d.date}: ₹${d.revenue}`}
          />
          <span className="text-[9px] text-slate-400 rotate-0 hidden sm:block">
            {new Date(d.date).getDate()}
          </span>
        </div>
      ))}
    </div>
  )
}

function AdminAnalytics() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-demand-analytics'],
    queryFn: async () => (await adminService.getDemandAnalytics({ trend_days: 14 })).data,
  })

  const revenue = data?.revenue ?? { today: 0, week: 0, month: 0, all_time: 0 }
  const orders = data?.orders ?? { today: 0, week: 0, month: 0, all_time: 0 }
  const topSelling = data?.top_selling ?? []
  const trend = data?.daily_trend ?? []

  return (
    <article aria-label="Demand Analytics" className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <MdAnalytics size={22} className="text-accent-600" aria-hidden="true" />
          Demand Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real sales data across every Jan Aushadhi Kendra
        </p>
      </div>

      {isError && (
        <p className="text-sm text-danger-600 bg-danger-50 border border-danger-200 rounded-xl px-4 py-3">
          Couldn't load analytics.{' '}
          <button type="button" onClick={() => refetch()} className="underline font-medium">Retry</button>
        </p>
      )}

      {/* Revenue + orders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <InfoCard label="Today's Revenue"  value={isLoading ? '…' : `₹${revenue.today}`}  subtitle={isLoading ? '' : `${orders.today} orders`}  icon={<HiOutlineCurrencyRupee size={18} />} />
        <InfoCard label="This Week"        value={isLoading ? '…' : `₹${revenue.week}`}   subtitle={isLoading ? '' : `${orders.week} orders`}   icon={<HiOutlineShoppingCart size={18} />} />
        <InfoCard label="This Month"       value={isLoading ? '…' : `₹${revenue.month}`}  subtitle={isLoading ? '' : `${orders.month} orders`}  icon={<HiOutlineChartBar size={18} />} />
        <InfoCard label="All-Time Revenue" value={isLoading ? '…' : `₹${revenue.all_time}`} subtitle={isLoading ? '' : `${orders.all_time} orders`} variant="success" icon={<HiOutlineCurrencyRupee size={18} />} />
      </div>

      {/* Daily sales trend */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Sales Trend — Last 14 Days</h2>
        {isLoading && <p className="text-xs text-slate-400">Loading…</p>}
        {!isLoading && <TrendBarChart data={trend} />}
      </div>

      {/* Top-selling medicines */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Top-Selling Medicines</h2>
        {isLoading && <p className="text-xs text-slate-400">Loading…</p>}
        {!isLoading && topSelling.length === 0 && (
          <p className="text-xs text-slate-400">No sales recorded yet.</p>
        )}
        <div className="flex flex-col divide-y divide-slate-50">
          {topSelling.map((m, i) => (
            <div key={m.pmbi_code} className="flex items-center gap-3 py-2.5">
              <span className="w-5 text-xs font-bold text-slate-400">{i + 1}</span>
              <MdMedication size={16} className="text-primary-500 shrink-0" aria-hidden="true" />
              <span className="flex-1 text-xs font-semibold text-slate-900 truncate">{m.medicine_name}</span>
              <span className="text-xs text-slate-500">{m.quantity} units</span>
              <span className="text-xs font-bold text-slate-900 w-20 text-right">₹{m.revenue}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-slate-400">
        "Most searched medicines" and "users waiting for a medicine" aren't shown —
        the backend doesn't track search queries or stock-alert subscriptions yet.
      </p>
    </article>
  )
}

export default AdminAnalytics