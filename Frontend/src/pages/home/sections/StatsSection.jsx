/**
 * StatsSection — Platform at a Glance
 *
 * Requirement 2: Replace placeholder stats with official PM Jan Aushadhi
 * / Government of India statistics where verified.
 *
 * Sources:
 *  - pmjanaushadhi.gov.in (official portal)
 *  - Department of Pharmaceuticals, Ministry of Chemicals & Fertilizers
 *  - Press Information Bureau (PIB) releases
 *
 * NOTE: Platform-specific stats (users, searches) remain as placeholders
 * because they depend on live backend data via GET /api/v1/stats/platform.
 * Government statistics are marked with their source.
 */

import { MdMedication, MdLocalPharmacy } from 'react-icons/md'
import { HiOutlineUsers, HiOutlineSparkles, HiOutlineCurrencyRupee, HiOutlineBuildingStorefront } from 'react-icons/hi2'

// ─────────────────────────────────────────────────────────────────────────────
// Statistics
//
// Official PM Jan Aushadhi figures (as of latest available data):
//   • 10,000+ Jan Aushadhi Kendras across India
//     Source: pmjanaushadhi.gov.in
//   • 2,047+ medicines and 300+ surgical items in PMBJP basket
//     Source: Department of Pharmaceuticals, 2024
//   • Savings of up to 90% compared to branded medicines
//     Source: pmjanaushadhi.gov.in
//   • Available in all 36 States & UTs
//     Source: PIB, Government of India
//
// Platform-specific stats (replace with GET /api/v1/stats/platform):
//   • Registered Users — TODO: live from backend
// ─────────────────────────────────────────────────────────────────────────────
const STATS = [
  {
    icon: HiOutlineBuildingStorefront,
    value: '10,000+',
    label: 'Jan Aushadhi Kendras',
    sublabel: 'Across India',
    isOfficial: true,
    source: 'pmjanaushadhi.gov.in',
    // TODO: validate against GET /api/v1/stats/platform → data.kendraCount
  },
  {
    icon: MdMedication,
    value: '2,047+',
    label: 'Generic Medicines',
    sublabel: 'In PMBJP basket',
    isOfficial: true,
    source: 'Department of Pharmaceuticals, 2024',
    // TODO: validate against GET /api/v1/stats/platform → data.medicineCount
  },
  {
    icon: HiOutlineCurrencyRupee,
    value: 'Up to 90%',
    label: 'Cost Savings',
    sublabel: 'vs. branded medicines',
    isOfficial: true,
    source: 'pmjanaushadhi.gov.in',
  },
  {
    icon: HiOutlineUsers,
    // TODO: replace with live API data → data.registeredUserCount
    value: '000+',
    label: 'Registered Users',
    sublabel: 'On this platform',
    isOfficial: false,
    source: null,
  },
]

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, sublabel, isOfficial }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 px-4 group">
      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors duration-200 mb-1">
        <Icon size={22} className="text-primary-300" aria-hidden="true" />
      </div>

      {/* Value */}
      <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        {value}
      </span>

      {/* Label */}
      <span className="text-sm font-semibold text-primary-200">{label}</span>

      {/* Sublabel */}
      <span className="text-xs text-slate-400">{sublabel}</span>

      {/* Official source indicator */}
      {isOfficial && (
        <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-emerald-300 font-medium">
          <span aria-hidden="true">✓</span> Official
        </span>
      )}
    </div>
  )
}

// ── StatsSection ──────────────────────────────────────────────────────────────
function StatsSection() {
  return (
    <section
      aria-labelledby="stats-heading"
      className="bg-slate-900 py-16"
    >
      <div className="container-app">

        {/* Visually hidden heading for accessibility */}
        <h2 id="stats-heading" className="sr-only">Platform at a Glance</h2>

        {/* Eyebrow */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-400">
            Platform at a Glance
          </span>
          <p className="mt-2 text-slate-300 text-lg font-semibold">
            Real impact — backed by Government of India initiative
          </p>
        </div>

        {/* Stats grid: 2-col mobile, 4-col desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-slate-700/60">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Source attribution */}
        <div className="text-center mt-8 space-y-1">
          <p className="text-[11px] text-slate-500">
            ✓ Official figures sourced from{' '}
            <a
              href="https://pmjanaushadhi.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-400 underline underline-offset-2"
            >
              pmjanaushadhi.gov.in
            </a>
            {' '}and the Department of Pharmaceuticals, Government of India.
          </p>
          <p className="text-[11px] text-slate-600">
            {/* TODO: Replace "Registered Users" with live data from GET /api/v1/stats/platform */}
            Platform user statistics will reflect live data once the backend API is connected.
          </p>
        </div>

      </div>
    </section>
  )
}

export default StatsSection
