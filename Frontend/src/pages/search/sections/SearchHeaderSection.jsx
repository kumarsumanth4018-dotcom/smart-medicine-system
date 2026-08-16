/**
 * Component: SearchHeaderSection
 *
 * Purpose:
 *   Premium hero header for the Medicine Search page.
 *   Creates an immediate professional first impression and
 *   clearly communicates what the search page offers.
 *
 * Responsibilities:
 *   - Display page title and descriptive subtitle
 *   - Render healthcare SVG illustration placeholder (swappable)
 *   - Subtle dot-grid background pattern for visual depth
 *   - Responsive two-column layout (copy + illustration)
 *
 * Dependencies:
 *   - React Icons (hi2, md)
 *   - Tailwind design system tokens
 *
 * Illustration:
 *   The SVG is a placeholder. Replace the <SearchIllustration />
 *   component with a real asset without changing the surrounding layout.
 */

import { HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineClock } from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'

// =====================================================
// Healthcare Search SVG Illustration Placeholder
// =====================================================
function SearchIllustration() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-50 via-white to-secondary-50 border border-primary-100 flex items-center justify-center overflow-hidden shadow-md"
    >
      <svg
        viewBox="0 0 360 270"
        className="w-4/5 h-4/5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Search bar shape */}
        <rect x="40" y="100" width="280" height="52" rx="26" fill="white" stroke="#bfdbfe" strokeWidth="2" filter="drop-shadow(0 4px 12px rgba(59,130,246,0.10))" />
        {/* Search icon circle */}
        <circle cx="72" cy="126" r="14" fill="#eff6ff" />
        <circle cx="70" cy="124" r="6" stroke="#3b82f6" strokeWidth="2" fill="none" />
        <path d="M74.5 128.5 L78 132" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        {/* Cursor / text lines inside bar */}
        <rect x="94" y="120" width="80" height="4" rx="2" fill="#bfdbfe" />
        <rect x="94" y="128" width="50" height="4" rx="2" fill="#dbeafe" />
        {/* Blinking cursor */}
        <rect x="148" y="119" width="2" height="14" rx="1" fill="#3b82f6" opacity="0.8" />

        {/* Result card 1 */}
        <rect x="40" y="170" width="130" height="64" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1.5" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.06))" />
        <circle cx="62" cy="190" r="10" fill="#dbeafe" />
        <path d="M57 190h10M62 185v10" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="78" y="185" width="68" height="5" rx="2.5" fill="#bfdbfe" />
        <rect x="78" y="194" width="50" height="4" rx="2" fill="#e0e7ff" />
        <rect x="55" y="208" width="52" height="14" rx="7" fill="#dcfce7" />
        <rect x="59" y="213" width="44" height="4" rx="2" fill="#86efac" />

        {/* Result card 2 */}
        <rect x="190" y="170" width="130" height="64" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1.5" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.06))" />
        <circle cx="212" cy="190" r="10" fill="#ccfbf1" />
        <path d="M207 190h10M212 185v10" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="228" y="185" width="68" height="5" rx="2.5" fill="#99f6e4" />
        <rect x="228" y="194" width="46" height="4" rx="2" fill="#b2f5ea" />
        <rect x="205" y="208" width="52" height="14" rx="7" fill="#fef3c7" />
        <rect x="209" y="213" width="44" height="4" rx="2" fill="#fcd34d" />

        {/* Floating sparkle dots */}
        <circle cx="320" cy="60"  r="5" fill="#e0e7ff" />
        <circle cx="308" cy="80"  r="3" fill="#c7d2fe" />
        <circle cx="335" cy="85"  r="4" fill="#dbeafe" />
        <circle cx="30"  cy="60"  r="4" fill="#ccfbf1" />
        <circle cx="20"  cy="80"  r="3" fill="#99f6e4" />
        <circle cx="42"  cy="78"  r="5" fill="#d1fae5" />

        {/* Pill decoration top-right */}
        <ellipse cx="300" cy="40" rx="28" ry="12" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
        <line x1="300" y1="28" x2="300" y2="52" stroke="#93c5fd" strokeWidth="1.5" />

        {/* Medicine capsule bottom-left */}
        <ellipse cx="55" cy="50" rx="22" ry="10" fill="#ccfbf1" stroke="#5eead4" strokeWidth="1.5" />
        <line x1="55" y1="40" x2="55" y2="60" stroke="#5eead4" strokeWidth="1.5" />
      </svg>

      {/* Corner badge */}
      <div className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-primary-100">
        <MdMedication size={16} className="text-primary-600" aria-hidden="true" />
      </div>
    </div>
  )
}

// =====================================================
// Trust / capability badges shown below headline
// =====================================================
const TRUST_BADGES = [
  { icon: HiOutlineSparkles,    text: 'Intelligent Recommendations' },
  { icon: HiOutlineShieldCheck, text: 'Quality Assured Generics'    },
  { icon: HiOutlineClock,       text: 'Real-Time Availability'      },
]

// =====================================================
// Search Header Section
// =====================================================
function SearchHeaderSection() {
  return (
    <section
      aria-labelledby="search-page-heading"
      className="relative overflow-hidden bg-white pb-8 pt-6"
    >
      {/* Dot-grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none"
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        {/* ── Left: copy ──────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 w-fit">
            <MdMedication size={14} className="text-primary-600" aria-hidden="true" />
            <span className="text-xs font-semibold text-primary-700 tracking-wide uppercase">
              Smart Medicine Search
            </span>
          </div>

          {/* Heading */}
          <h1
            id="search-page-heading"
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight"
          >
            Find Medicines{' '}
            <span className="text-primary-600">Faster</span>{' '}
            &amp;{' '}
            <span className="text-secondary-600">Smarter</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-lg">
            Search branded medicines, discover PM Jan Aushadhi alternatives,
            compare medicines and locate nearby pharmacies using intelligent
            healthcare technology.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100 mt-1">
            {TRUST_BADGES.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 text-xs text-slate-500"
              >
                <Icon size={13} className="text-primary-500 shrink-0" aria-hidden="true" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: illustration ──────────────────────────────── */}
        <div className="flex justify-center lg:justify-end">
          <SearchIllustration />
        </div>

      </div>
    </section>
  )
}

export default SearchHeaderSection
