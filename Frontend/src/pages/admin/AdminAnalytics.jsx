/**
 * Component: AdminAnalytics
 *
 * Description: Platform analytics dashboard with chart placeholders.
 * Backend readiness: TODO: GET /api/v1/admin/analytics
 */

import { HiOutlineChartBar, HiOutlineCpuChip } from 'react-icons/hi2'
import { MdAnalytics } from 'react-icons/md'
import Badge from '../../components/ui/Badge'
import InfoCard from '../../components/cards/InfoCard'

const KPI = [
  { label: 'Medicine Searches',        value: '000', subtitle: 'Today · TODO: API' },
  { label: 'Generic Recommendations',  value: '000', subtitle: 'This week · TODO: API' },
  { label: 'Active Users',             value: '000', subtitle: 'Last 30 days · TODO: API' },
  { label: 'Pharmacy Interactions',    value: '000', subtitle: 'This month · TODO: API' },
]

const CHART_PLACEHOLDERS = [
  { title: 'Medicine Searches Over Time', w: 'col-span-2' },
  { title: 'Generic Recommendation Usage', w: 'col-span-1' },
  { title: 'User Growth', w: 'col-span-1' },
  { title: 'Top 10 Medicines', w: 'col-span-1' },
  { title: 'Popular Generics', w: 'col-span-1' },
  { title: 'Platform Activity', w: 'col-span-2' },
]

function AdminAnalytics() {
  return (
    <article aria-label="Platform Analytics" className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <MdAnalytics size={22} className="text-accent-600" aria-hidden="true" />
          Platform Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">TODO: GET /api/v1/admin/analytics</p>
      </div>

      {/* ======================================================
          Analytics
         ====================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {KPI.map(k => <InfoCard key={k.label} label={k.label} value={k.value} subtitle={k.subtitle} />)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHART_PLACEHOLDERS.map(c => (
          <div key={c.title} className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border border-dashed border-slate-200 bg-white text-center ${c.w === 'col-span-2' ? 'lg:col-span-2' : ''}`}>
            <HiOutlineChartBar size={32} className="text-slate-200" aria-hidden="true" />
            <p className="text-sm font-semibold text-slate-500">{c.title}</p>
            <Badge variant="neutral" size="sm">Chart Coming Soon</Badge>
            <p className="text-[10px] text-slate-400">TODO: GET /api/v1/admin/analytics/{c.title.toLowerCase().replace(/ /g,'-')}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
        <HiOutlineCpuChip size={28} className="text-slate-200" aria-hidden="true" />
        <p className="text-sm font-semibold text-slate-400">AI Recommendation Monitoring</p>
        <Badge variant="accent" size="sm">Coming Soon</Badge>
      </div>
    </article>
  )
}

export default AdminAnalytics
