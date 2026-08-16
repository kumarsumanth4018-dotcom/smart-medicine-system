/**
 * Component: SmartFeaturesSection
 *
 * Purpose:
 *   Showcases four future intelligent search capabilities as
 *   professional UI placeholder cards. Builds product awareness
 *   and communicates the platform's roadmap to users.
 *
 * Responsibilities:
 *   - Render four feature cards: Voice Search, OCR Prescription
 *     Scanner, Barcode Scanner, Generic Medicine Finder
 *   - Display "Coming Soon" badge on unimplemented features
 *   - Display "Navigate" indicator on available Generic Finder
 *   - All cards are UI-only placeholders — no functionality
 *
 * Dependencies:
 *   - Badge (components/ui) — reused for Coming Soon labels
 *   - React Icons (hi2, md)
 *   - ROUTES (constants/routes)
 *
 * Implementation status:
 *   Voice Search       — UI placeholder only (future ML module)
 *   OCR Scanner        — UI placeholder only (future CV module)
 *   Barcode Scanner    — UI placeholder only (future CV module)
 *   Generic Finder     — Navigation placeholder → /search (this page)
 *
 * Each SVG is a minimal inline illustration placeholder —
 * replace with a real asset without touching surrounding layout.
 */

import { Link } from 'react-router-dom'
import {
  HiOutlineMicrophone,
  HiOutlineCamera,
  HiOutlineQrCode,
  HiOutlineArrowRight,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'
import { ROUTES } from '../../../constants/routes'

// =====================================================
// Feature card data
// =====================================================
const SMART_FEATURES = [
  {
    id: 'voice-search',
    icon: HiOutlineMicrophone,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    accentColor: 'border-t-primary-500',
    title: 'Voice Search',
    description:
      'Search for medicines using your voice. Speak the medicine name or describe your symptoms for intelligent suggestions.',
    status: 'coming-soon',
    IllustrationSvg: VoiceIllustration,
  },
  {
    id: 'ocr-scanner',
    icon: HiOutlineCamera,
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-600',
    accentColor: 'border-t-secondary-500',
    title: 'Prescription Scanner',
    description:
      'Upload or capture a prescription image. Our OCR technology reads the medicine names and searches them automatically.',
    status: 'coming-soon',
    IllustrationSvg: OcrIllustration,
  },
  {
    id: 'barcode-scanner',
    icon: HiOutlineQrCode,
    iconBg: 'bg-accent-100',
    iconColor: 'text-accent-600',
    accentColor: 'border-t-accent-500',
    title: 'Barcode Scanner',
    description:
      'Scan a medicine barcode or QR code for instant identification, pricing, and generic alternative lookup.',
    status: 'coming-soon',
    IllustrationSvg: BarcodeIllustration,
  },
  {
    id: 'generic-finder',
    icon: MdMedication,
    iconBg: 'bg-success-100',
    iconColor: 'text-success-600',
    accentColor: 'border-t-success-500',
    title: 'Generic Medicine Finder',
    description:
      'Instantly discover affordable PM Jan Aushadhi alternatives for any branded medicine — same quality, lower cost.',
    status: 'available',
    actionTo: ROUTES.USER.SEARCH,
    actionLabel: 'Try Now',
    IllustrationSvg: GenericIllustration,
  },
]

// =====================================================
// Minimal SVG illustration placeholders
// Each is self-contained and replaceable independently
// =====================================================
function VoiceIllustration() {
  return (
    <svg viewBox="0 0 80 56" className="w-full h-full" fill="none" aria-hidden="true">
      <circle cx="40" cy="28" r="20" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
      <rect x="35" y="16" width="10" height="18" rx="5" fill="#3b82f6" />
      <path d="M28 28c0 6.63 5.37 12 12 12s12-5.37 12-12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="40" y1="40" x2="40" y2="46" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="46" x2="46" y2="46" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      {[4,3,5,3,4].map((h, i) => (
        <rect key={i} x={10 + i * 5} y={28 - h} width="3" height={h * 2} rx="1.5" fill="#bfdbfe" opacity="0.8" />
      ))}
      {[3,5,4,3,5].map((h, i) => (
        <rect key={i} x={58 + i * 5} y={28 - h} width="3" height={h * 2} rx="1.5" fill="#bfdbfe" opacity="0.8" />
      ))}
    </svg>
  )
}

function OcrIllustration() {
  return (
    <svg viewBox="0 0 80 56" className="w-full h-full" fill="none" aria-hidden="true">
      <rect x="20" y="8" width="40" height="40" rx="6" fill="#f0fdfa" stroke="#99f6e4" strokeWidth="1.5" />
      {/* Prescription lines */}
      <rect x="26" y="16" width="28" height="3" rx="1.5" fill="#5eead4" />
      <rect x="26" y="22" width="20" height="3" rx="1.5" fill="#99f6e4" />
      <rect x="26" y="28" width="24" height="3" rx="1.5" fill="#99f6e4" />
      <rect x="26" y="34" width="18" height="3" rx="1.5" fill="#99f6e4" />
      {/* Corner scan brackets */}
      <path d="M10 20 L10 10 L20 10" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 10 L70 10 L70 20" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M10 36 L10 46 L20 46" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 46 L70 46 L70 36" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function BarcodeIllustration() {
  return (
    <svg viewBox="0 0 80 56" className="w-full h-full" fill="none" aria-hidden="true">
      <rect x="12" y="10" width="56" height="36" rx="6" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="1.5" />
      {/* Barcode stripes */}
      {[18,21,25,27,32,35,38,42,45,49,53].map((x, i) => (
        <rect key={i} x={x} y="17" width={i % 3 === 0 ? 2 : 1} height="22" rx="0.5" fill="#6366f1" opacity="0.7" />
      ))}
      <rect x="18" y="39" width="44" height="3" rx="1.5" fill="#c7d2fe" />
      {/* QR corner dots */}
      <rect x="16" y="14" width="4" height="4" rx="1" fill="#4f46e5" />
      <rect x="60" y="14" width="4" height="4" rx="1" fill="#4f46e5" />
      <rect x="16" y="32" width="4" height="4" rx="1" fill="#4f46e5" />
    </svg>
  )
}

function GenericIllustration() {
  return (
    <svg viewBox="0 0 80 56" className="w-full h-full" fill="none" aria-hidden="true">
      {/* Branded pill */}
      <ellipse cx="26" cy="28" rx="16" ry="8" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1.5" />
      <line x1="26" y1="20" x2="26" y2="36" stroke="#fcd34d" strokeWidth="1.5" />
      {/* Arrow */}
      <path d="M46 28 L54 28" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
      <path d="M51 24 L55 28 L51 32" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Generic / Jan Aushadhi pill */}
      <ellipse cx="65" cy="28" rx="14" ry="7" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5" />
      <line x1="65" y1="21" x2="65" y2="35" stroke="#86efac" strokeWidth="1.5" />
      {/* Price tags */}
      <text x="18" y="48" fill="#d97706" fontSize="7" fontWeight="700" fontFamily="sans-serif">₹180</text>
      <text x="56" y="48" fill="#16a34a" fontSize="7" fontWeight="700" fontFamily="sans-serif">₹36</text>
    </svg>
  )
}

// =====================================================
// Feature Card sub-component
// =====================================================
function SmartFeatureCard({ icon: Icon, iconBg, iconColor, accentColor, title, description, status, actionTo, actionLabel, IllustrationSvg }) {
  const isComingSoon = status === 'coming-soon'

  return (
    <div
      className={[
        'group relative flex flex-col gap-4 p-5 rounded-xl bg-white border border-slate-100',
        'shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        `border-t-2 ${accentColor}`,
      ].join(' ')}
    >
      {/* Status badge — top right */}
      <div className="absolute top-4 right-4">
        {isComingSoon
          ? <Badge variant="neutral" size="sm">Coming Soon</Badge>
          : <Badge variant="success" size="sm" dot>Available</Badge>
        }
      </div>

      {/* Icon + SVG illustration */}
      <div className="flex items-start gap-3">
        <div className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${iconBg}`}>
          <Icon size={22} className={iconColor} aria-hidden="true" />
        </div>
        {/* Mini illustration placeholder */}
        <div className="flex-1 flex items-center justify-center h-14 max-w-[90px] ml-auto opacity-80">
          <IllustrationSvg />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>

      {/* Action footer */}
      <div className="pt-3 border-t border-slate-100">
        {isComingSoon ? (
          <span className="text-xs text-slate-400 italic">
            Feature under development
          </span>
        ) : (
          <Link
            to={actionTo}
            aria-label={`${actionLabel} — ${title}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-success-600 hover:text-success-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-500 rounded"
          >
            {actionLabel}
            <HiOutlineArrowRight size={13} aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  )
}

// =====================================================
// Smart Features Section
// =====================================================
function SmartFeaturesSection() {
  return (
    <section aria-labelledby="smart-features-heading" className="py-6">

      {/* Section header */}
      <div className="mb-5">
        <h2
          id="smart-features-heading"
          className="text-base font-bold text-slate-900"
        >
          Intelligent Search Methods
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Advanced search capabilities — available now and coming soon.
        </p>
      </div>

      {/* Feature cards grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        role="list"
        aria-label="Smart search feature cards"
      >
        {SMART_FEATURES.map((f) => (
          <div key={f.id} role="listitem">
            <SmartFeatureCard {...f} />
          </div>
        ))}
      </div>

    </section>
  )
}

export default SmartFeaturesSection
