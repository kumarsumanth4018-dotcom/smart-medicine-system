/**
 * Component: RecommendationHeader
 *
 * Description:
 *   Premium hero header for the Generic Recommendation page.
 *   Communicates the purpose immediately — helping users discover
 *   affordable PM Jan Aushadhi alternatives.
 *
 * Responsibilities:
 *   - Page title, subtitle, and trust indicator badges
 *   - SVG illustration placeholder (swappable asset)
 *   - Breadcrumb back to medicine details
 *
 * Backend readiness:
 *   - medicineName passed from parent via URL param
 */

import { Link } from 'react-router-dom'
import { HiOutlineArrowLeft, HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineCurrencyRupee } from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import { ROUTES } from '../../../constants/routes'

// =====================================================
// Generic Recommendation SVG Illustration Placeholder
// =====================================================
function RecommendationIllustration() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full max-w-xs mx-auto aspect-[4/3] rounded-2xl bg-gradient-to-br from-success-50 via-white to-primary-50 border border-success-100 flex items-center justify-center overflow-hidden shadow-md"
    >
      <svg viewBox="0 0 320 240" className="w-4/5 h-4/5" fill="none" aria-hidden="true">
        {/* Branded pill — larger, grey */}
        <ellipse cx="80" cy="130" rx="52" ry="24" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="80" y1="106" x2="80" y2="154" stroke="#cbd5e1" strokeWidth="2" />
        <text x="80" y="172" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">Branded ₹120</text>

        {/* Arrow */}
        <path d="M148 125 L172 125" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        <path d="M167 119 L173 125 L167 131" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Jan Aushadhi generic pill — smaller, green */}
        <ellipse cx="230" cy="130" rx="40" ry="18" fill="#dcfce7" stroke="#86efac" strokeWidth="2" />
        <line x1="230" y1="112" x2="230" y2="148" stroke="#86efac" strokeWidth="2" />
        <text x="230" y="166" textAnchor="middle" fontSize="9" fill="#16a34a" fontFamily="sans-serif" fontWeight="700">Generic ₹18</text>

        {/* Savings badge */}
        <rect x="138" y="80" width="44" height="22" rx="11" fill="#16a34a" />
        <text x="160" y="95" textAnchor="middle" fontSize="9" fill="white" fontFamily="sans-serif" fontWeight="700">85% off</text>

        {/* Quality badge */}
        <rect x="185" y="52" width="80" height="22" rx="8" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
        <text x="225" y="67" textAnchor="middle" fontSize="8" fill="#2563eb" fontFamily="sans-serif">WHO-GMP ✓</text>

        {/* Decorative dots */}
        {[20,35,50].map((y, i) => (
          <circle key={i} cx={290} cy={y} r="3" fill="#e2e8f0" opacity="0.7" />
        ))}
        {[210,225,240].map((y, i) => (
          <circle key={i} cx={30} cy={y} r="2.5" fill="#dcfce7" opacity="0.8" />
        ))}
      </svg>
      <div className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-success-100">
        <MdMedication size={16} className="text-success-600" aria-hidden="true" />
      </div>
    </div>
  )
}

const TRUST_BADGES = [
  { icon: HiOutlineSparkles,       text: 'AI-powered Recommendations'  },
  { icon: HiOutlineShieldCheck,    text: 'WHO-GMP Quality Assured'     },
  { icon: HiOutlineCurrencyRupee,  text: 'Up to 90% Cost Savings'      },
]

// =====================================================
// Recommendation Header
// =====================================================
function RecommendationHeader({ medicineName = 'Paracetamol 500mg', medicineId = '' }) {
  return (
    <section aria-labelledby="rec-page-heading" className="relative overflow-hidden bg-white pb-6 pt-2 rounded-2xl border border-slate-100 shadow-sm">
      {/* Dot-grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none rounded-2xl"
      />

      <div className="relative px-6 pt-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <Link to={ROUTES.USER.SEARCH} className="hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
            Search
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            to={ROUTES.USER.MEDICINE_DETAIL.replace(':id', medicineId)}
            className="hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
          >
            {medicineName}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-600 font-medium">Generic Alternatives</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: copy */}
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-50 border border-success-200 w-fit">
              <span className="w-2 h-2 rounded-full bg-success-500" aria-hidden="true" />
              <span className="text-xs font-semibold text-success-700 tracking-wide uppercase">
                PM Jan Aushadhi
              </span>
            </div>

            <h1
              id="rec-page-heading"
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight"
            >
              Recommended{' '}
              <span className="text-success-600">Generic</span>{' '}
              Alternatives
            </h1>

            <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
              Compare <strong className="text-slate-700">{medicineName}</strong> with affordable PM Jan Aushadhi generic alternatives and estimate your savings. Same composition, same quality, lower price.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
              {TRUST_BADGES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Icon size={13} className="text-success-500 shrink-0" aria-hidden="true" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: illustration */}
          <div className="flex justify-center lg:justify-end">
            <RecommendationIllustration />
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecommendationHeader
