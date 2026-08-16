/**
 * Component: QuickActionsSection
 *
 * Purpose:
 *   Provides users with quick access to alternative search methods
 *   directly below the main search bar. Each card communicates a
 *   specific capability without overwhelming the interface.
 *
 * Responsibilities:
 *   - Render four Quick Action cards in a responsive grid
 *   - Display "Coming Soon" badge on features not yet implemented
 *   - Display "Available" badge and navigation link on Generic Finder
 *   - Maintain visual hierarchy: search bar → quick actions → content
 *
 * Action Cards:
 *   1. Scan Prescription  — OCR upload placeholder (future CV module)
 *   2. Voice Search       — Speech recognition placeholder (future ML)
 *   3. Scan Barcode       — Barcode/QR scan placeholder (future CV)
 *   4. Generic Finder     — Navigation placeholder → /search
 *
 * Dependencies:
 *   - Badge  (components/ui) — Coming Soon / Available labels
 *   - React Router Link      — Generic Finder action
 *   - React Icons (hi2, md)
 *   - ROUTES (constants/routes)
 *
 * Design:
 *   Cards should NOT appear disabled. They communicate premium upcoming
 *   features and build product awareness. Cards use a top-accent border
 *   per feature colour, soft shadow, and hover lift animation.
 *
 * Backend readiness:
 *   All cards are UI placeholders. Implementation deferred to future modules.
 */

import { Link } from 'react-router-dom'
import {
  HiOutlineCamera,
  HiOutlineMicrophone,
  HiOutlineQrCode,
  HiOutlineArrowRight,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'
import { ROUTES } from '../../../constants/routes'

// ======================================
// Quick Actions data
// TODO: status flags will be driven by feature flags from API in future
// ======================================
const QUICK_ACTIONS = [
  {
    id: 'scan-prescription',
    icon: HiOutlineCamera,
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-600',
    topBorder: 'border-t-secondary-500',
    badge: { variant: 'neutral', label: 'Coming Soon' },
    title: 'Scan Prescription',
    description:
      'Upload or capture a prescription image. OCR technology automatically identifies and searches the medicines listed.',
    footer: null,
  },
  {
    id: 'voice-search',
    icon: HiOutlineMicrophone,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    topBorder: 'border-t-primary-500',
    badge: { variant: 'neutral', label: 'Coming Soon' },
    title: 'Voice Search',
    description:
      'Search medicines using your voice. Speak the medicine name or describe your symptoms for intelligent suggestions.',
    footer: null,
  },
  {
    id: 'scan-barcode',
    icon: HiOutlineQrCode,
    iconBg: 'bg-accent-100',
    iconColor: 'text-accent-600',
    topBorder: 'border-t-accent-500',
    badge: { variant: 'neutral', label: 'Coming Soon' },
    title: 'Scan Barcode',
    description:
      'Identify medicines instantly by scanning the barcode or QR code on the packaging for pricing and alternatives.',
    footer: null,
  },
  {
    id: 'generic-finder',
    icon: MdMedication,
    iconBg: 'bg-success-100',
    iconColor: 'text-success-600',
    topBorder: 'border-t-success-500',
    badge: { variant: 'success', label: 'Available', dot: true },
    title: 'Generic Medicine Finder',
    description:
      'Discover affordable PM Jan Aushadhi alternatives for any branded medicine — same quality, significantly lower cost.',
    footer: {
      to: ROUTES.USER.SEARCH,
      label: 'Search Now',
    },
  },
]

// ======================================
// QuickActionCard sub-component
// ======================================
function QuickActionCard({ id, icon: Icon, iconBg, iconColor, topBorder, badge, title, description, footer }) {
  return (
    <article
      aria-labelledby={`quick-action-${id}-title`}
      className={[
        'relative flex flex-col gap-3 p-5 rounded-xl bg-white border border-slate-100',
        'shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        `border-t-2 ${topBorder}`,
      ].join(' ')}
    >
      {/* Status badge — top right */}
      <div className="absolute top-4 right-4">
        <Badge variant={badge.variant} size="sm" dot={badge.dot}>
          {badge.label}
        </Badge>
      </div>

      {/* Icon */}
      <div className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${iconBg}`}>
        <Icon size={22} className={iconColor} aria-hidden="true" />
      </div>

      {/* Text */}
      <div className="flex-1 pr-10">
        <h3
          id={`quick-action-${id}-title`}
          className="text-sm font-semibold text-slate-900 mb-1.5"
        >
          {title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>

      {/* Footer action or coming-soon note */}
      <div className="pt-3 border-t border-slate-100">
        {footer ? (
          <Link
            to={footer.to}
            aria-label={`${footer.label} — ${title}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-success-600 hover:text-success-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-500 rounded"
          >
            {footer.label}
            <HiOutlineArrowRight size={13} aria-hidden="true" />
          </Link>
        ) : (
          <span className="text-xs text-slate-400 italic">
            Feature under development
          </span>
        )}
      </div>
    </article>
  )
}

// ======================================
// Quick Actions Section
// ======================================
function QuickActionsSection() {
  return (
    <section aria-labelledby="quick-actions-heading" className="py-6">

      {/* Section header */}
      <div className="mb-5">
        <h2
          id="quick-actions-heading"
          className="text-base font-bold text-slate-900"
        >
          Quick Actions
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Alternative ways to find medicines — available now and coming soon.
        </p>
      </div>

      {/* Cards grid: 1 → 2 → 4 columns */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        role="list"
        aria-label="Quick action options"
      >
        {QUICK_ACTIONS.map((action) => (
          <div key={action.id} role="listitem">
            <QuickActionCard {...action} />
          </div>
        ))}
      </div>

    </section>
  )
}

export default QuickActionsSection
