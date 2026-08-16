/**
 * Component: SavingsDashboard
 *
 * Description:
 *   Premium savings dashboard displaying today's, monthly, and yearly
 *   estimated savings with a visual progress ring and bar chart placeholder.
 *
 * Responsibilities:
 *   - Today / Monthly / Yearly savings stat cards
 *   - Percentage saved progress ring (SVG placeholder)
 *   - Savings trend bar chart (CSS bar placeholder)
 *   - All values are placeholders — no calculation logic
 *
 * Backend readiness:
 *   - savings → GET /api/v1/medicines/:id/savings-dashboard
 *   - trend   → GET /api/v1/users/me/savings-trend
 */

import { HiOutlineCurrencyRupee, HiOutlineTrendingUp } from 'react-icons/hi'
import { HiOutlineChartBar } from 'react-icons/hi2'
import Badge from '../../../components/ui/Badge'

// ======================================================
// Progress ring placeholder
// ======================================================
function SavingsRing({ pct = 85 }) {
  const r    = 52
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="130" height="130" viewBox="0 0 130 130" aria-label={`${pct}% savings`}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={r}
          fill="none" stroke="url(#savingsGrad)"
          strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ / 4}
        />
        <defs>
          <linearGradient id="savingsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <text x="65" y="58" textAnchor="middle" fontSize="22" fontWeight="800" fill="#15803d" fontFamily="sans-serif">{pct}%</text>
        <text x="65" y="76" textAnchor="middle" fontSize="10" fill="#86efac" fontFamily="sans-serif">Savings</text>
      </svg>
      <p className="text-[10px] text-slate-400">
        {/* TODO: savings pct from API */}
        Placeholder estimate
      </p>
    </div>
  )
}

// ======================================================
// Bar chart placeholder
// ======================================================
const TREND_BARS = [
  { label: 'Jan', height: 40 },
  { label: 'Feb', height: 55 },
  { label: 'Mar', height: 45 },
  { label: 'Apr', height: 70 },
  { label: 'May', height: 60 },
  { label: 'Jun', height: 85 },
]

function SavingsTrendChart() {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-1.5">
        <HiOutlineChartBar size={14} className="text-primary-500" aria-hidden="true" />
        Savings Trend
        <span className="text-[10px] text-slate-400 font-normal ml-1">
          {/* TODO: trend data from GET /api/v1/users/me/savings-trend */}
          Placeholder
        </span>
      </p>
      <div
        className="flex items-end gap-2 h-20"
        role="img"
        aria-label="Savings trend bar chart placeholder"
      >
        {TREND_BARS.map((bar) => (
          <div key={bar.label} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="w-full rounded-t-md bg-primary-400 hover:bg-primary-500 transition-colors"
              style={{ height: `${bar.height}%` }}
            />
            <span className="text-[9px] text-slate-400">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ======================================================
// Savings Dashboard
// ======================================================
function SavingsDashboard({ savings = {} }) {
  // TODO: replace with GET /api/v1/medicines/:id/savings-dashboard
  const {
    today   = 102,
    monthly = 306,
    yearly  = 3672,
    pct     = 85,
  } = savings

  const stats = [
    { label: "Today's Savings",  value: `₹${today}`,   sub: 'Per purchase',     variant: 'success' },
    { label: 'Monthly Savings',  value: `₹${monthly}`, sub: 'Est. 3 tablets/day', variant: 'primary' },
    { label: 'Yearly Savings',   value: `₹${yearly}`,  sub: 'Annual estimate',  variant: 'accent'   },
  ]

  return (
    <section aria-labelledby="savings-dashboard-heading">

      {/* ======================================================
          Savings Dashboard
         ====================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <HiOutlineCurrencyRupee size={18} className="text-success-600" aria-hidden="true" />
          <h2 id="savings-dashboard-heading" className="text-base font-bold text-slate-900">
            Savings Dashboard
          </h2>
          <Badge variant="success" size="sm">{pct}% saved</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-start">
          {/* Ring */}
          <div className="flex justify-center">
            <SavingsRing pct={pct} />
          </div>

          {/* Stats + chart */}
          <div className="flex flex-col gap-4">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-100 text-center"
                >
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{s.label}</p>
                  <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                  <p className="text-[10px] text-slate-400">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Trend chart */}
            <SavingsTrendChart />
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center mt-4">
          {/* TODO: all values from GET /api/v1/medicines/:id/savings-dashboard */}
          All savings figures are estimates based on typical prescription frequency. Actual savings may vary.
        </p>
      </div>
    </section>
  )
}

export default SavingsDashboard
