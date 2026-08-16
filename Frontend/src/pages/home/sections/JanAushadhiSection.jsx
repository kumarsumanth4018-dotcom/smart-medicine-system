/**
 * Component: JanAushadhiSection
 *
 * Purpose:
 *   Educates visitors about the Pradhan Mantri Jan Aushadhi Pariyojana
 *   (PMJAP) using factual, professional language sourced from
 *   pmjanaushadhi.gov.in. Builds credibility through government backing.
 *
 * Responsibilities:
 *   - Display descriptive copy about PMJAP
 *   - Render four highlight cards with indicative initiative statistics
 *   - Show SVG storefront illustration placeholder (replaceable)
 *   - Source attribution footer note
 *
 * Dependencies:
 *   - React Icons (hi2, md)
 *   - Tailwind design system tokens
 *
 * Note: All figures are indicative. Source: pmjanaushadhi.gov.in
 */

import {
  HiOutlineBuildingStorefront,
  HiOutlineCurrencyRupee,
  HiOutlineClipboardDocumentList,
  HiOutlineGlobeAlt,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'

const HIGHLIGHTS = [
  {
    icon: HiOutlineBuildingStorefront,
    label: '10,000+',
    sublabel: 'Jan Aushadhi Kendras',
    description: 'Dedicated generic medicine stores across India',
    color: 'text-primary-600 bg-primary-50',
  },
  {
    icon: HiOutlineClipboardDocumentList,
    label: '1,900+',
    sublabel: 'Medicine Products',
    description: 'Quality generic medicines listed in the PMJAP basket',
    color: 'text-secondary-600 bg-secondary-50',
  },
  {
    icon: HiOutlineCurrencyRupee,
    label: 'Up to 90%',
    sublabel: 'Cost Savings',
    description: 'Generic medicines are significantly more affordable than branded ones',
    color: 'text-success-600 bg-success-50',
  },
  {
    icon: HiOutlineGlobeAlt,
    label: 'Pan India',
    sublabel: 'Coverage',
    description: 'Available across all 28 states and 8 union territories',
    color: 'text-accent-600 bg-accent-50',
  },
]

// SVG placeholder for Jan Aushadhi illustration
function JanAushadhiIllustration() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full aspect-square max-w-sm mx-auto rounded-2xl bg-gradient-to-br from-secondary-50 to-primary-50 border border-secondary-100 flex items-center justify-center overflow-hidden shadow-md"
    >
      <svg viewBox="0 0 280 280" className="w-4/5 h-4/5" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Storefront */}
        <rect x="60" y="110" width="160" height="120" rx="8" fill="white" stroke="#bfdbfe" strokeWidth="2" />
        {/* Roof */}
        <path d="M50 115 L140 65 L230 115 Z" fill="#dbeafe" stroke="#93c5fd" strokeWidth="2" />
        {/* Door */}
        <rect x="108" y="170" width="44" height="60" rx="4" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="1.5" />
        <circle cx="148" cy="200" r="3" fill="#0ea5e9" />
        {/* Window left */}
        <rect x="72" y="140" width="42" height="32" rx="4" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1.5" />
        <line x1="93" y1="140" x2="93" y2="172" stroke="#bae6fd" strokeWidth="1" />
        <line x1="72" y1="156" x2="114" y2="156" stroke="#bae6fd" strokeWidth="1" />
        {/* Window right */}
        <rect x="166" y="140" width="42" height="32" rx="4" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1.5" />
        <line x1="187" y1="140" x2="187" y2="172" stroke="#bae6fd" strokeWidth="1" />
        <line x1="166" y1="156" x2="208" y2="156" stroke="#bae6fd" strokeWidth="1" />
        {/* Sign */}
        <rect x="88" y="80" width="104" height="26" rx="5" fill="#2563eb" />
        <text x="140" y="97" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="sans-serif">JAN AUSHADHI</text>
        {/* Medicines on shelf */}
        <rect x="75" y="118" width="12" height="22" rx="3" fill="#99f6e4" stroke="#5eead4" strokeWidth="1" />
        <rect x="91" y="121" width="10" height="19" rx="3" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1" />
        <rect x="105" y="119" width="12" height="21" rx="3" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />
        {/* Green cross */}
        <circle cx="214" cy="90" r="14" fill="#dcfce7" />
        <path d="M207 90h14M214 83v14" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function HighlightCard({ icon: Icon, label, sublabel, description, color }) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${color}`}>
        <Icon size={18} aria-hidden="true" />
      </div>
      <p className="text-xl font-extrabold text-slate-900 leading-none">{label}</p>
      <p className="text-xs font-semibold text-slate-600">{sublabel}</p>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}

function JanAushadhiSection() {
  return (
    <section
      aria-labelledby="janaushadhi-heading"
      className="section bg-white"
    >
      <div className="container-app">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Illustration ─────────────────────────────────────── */}
          <div className="order-2 lg:order-1">
            <JanAushadhiIllustration />
          </div>

          {/* ── Content ──────────────────────────────────────────── */}
          <div className="order-1 lg:order-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary-600">
              Government Initiative
            </span>
            <h2
              id="janaushadhi-heading"
              className="mt-2 text-3xl font-bold text-slate-900 tracking-tight leading-snug"
            >
              Pradhan Mantri Jan Aushadhi Pariyojana
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              The PM Jan Aushadhi Pariyojana (PMJAP) is a campaign launched by the Department of
              Pharmaceuticals, Government of India, to provide quality generic medicines at affordable
              prices to all citizens through dedicated outlets called Jan Aushadhi Kendras.
            </p>
            <p className="mt-3 text-slate-500 leading-relaxed">
              Generic medicines contain the same active ingredients as their branded counterparts and
              meet the same quality, safety, and efficacy standards — often costing significantly less.
            </p>

            {/* Highlight grid */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {HIGHLIGHTS.map((h) => (
                <HighlightCard key={h.label} {...h} />
              ))}
            </div>

            {/* Source note */}
            <p className="mt-4 text-[11px] text-slate-400">
              Source: pmjanaushadhi.gov.in — figures are indicative and subject to change.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

export default JanAushadhiSection
