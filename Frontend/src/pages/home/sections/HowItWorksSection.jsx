/**
 * HowItWorksSection
 *
 * Six-step visual workflow showing how a patient uses the platform.
 * Desktop: horizontal step cards connected by a dashed line.
 * Mobile / tablet: vertical stacked cards with a left-side line.
 *
 * Steps (Module 6 Part 2 spec):
 *   Search Medicine → View Medicine Details → Find Generic Alternative
 *   → Locate Nearby Pharmacy → Check Availability → Save Money
 */

import {
  HiOutlineMagnifyingGlass,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentText,
  HiOutlineMapPin,
  HiOutlineCheckBadge,
  HiOutlineCurrencyRupee,
} from 'react-icons/hi2'

// ==========================================
// Step data
// ==========================================
const STEPS = [
  {
    step: '01',
    icon: HiOutlineMagnifyingGlass,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-700',
    ringColor: 'ring-primary-200',
    title: 'Search Medicine',
    description:
      'Enter a medicine name, brand, or composition in the intelligent search bar to instantly find results.',
  },
  {
    step: '02',
    icon: HiOutlineClipboardDocumentList,
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-700',
    ringColor: 'ring-secondary-200',
    title: 'View Medicine Details',
    description:
      'Review full details including active ingredients, dosage, pricing, manufacturer, and availability status.',
  },
  {
    step: '03',
    icon: HiOutlineDocumentText,
    iconBg: 'bg-info-100',
    iconColor: 'text-info-700',
    ringColor: 'ring-info-200',
    title: 'Find Generic Alternative',
    description:
      'Discover affordable PM Jan Aushadhi generic alternatives suggested by our recommendation engine.',
  },
  {
    step: '04',
    icon: HiOutlineMapPin,
    iconBg: 'bg-success-100',
    iconColor: 'text-success-700',
    ringColor: 'ring-success-200',
    title: 'Locate Nearby Pharmacy',
    description:
      'Find the nearest Jan Aushadhi Kendra or pharmacy with your chosen medicine in stock using the interactive map.',
  },
  {
    step: '05',
    icon: HiOutlineCheckBadge,
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-700',
    ringColor: 'ring-warning-200',
    title: 'Check Availability',
    description:
      'Verify real-time stock availability at your chosen pharmacy before making the trip.',
  },
  {
    step: '06',
    icon: HiOutlineCurrencyRupee,
    iconBg: 'bg-accent-100',
    iconColor: 'text-accent-700',
    ringColor: 'ring-accent-200',
    title: 'Save Money',
    description:
      'Get quality generic medicines at up to 90% lower cost, making healthcare genuinely affordable.',
  },
]

// ==========================================
// StepCard sub-component
// ==========================================
function StepCard({ step, icon: Icon, iconBg, iconColor, ringColor, title, description }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 relative">
      {/* Icon circle with step badge */}
      <div
        className={`relative flex items-center justify-center w-16 h-16 rounded-full ring-4 ${iconBg} ${iconColor} ${ringColor}`}
      >
        <Icon size={26} aria-hidden="true" />
        <span
          aria-hidden="true"
          className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-slate-200 text-[10px] font-bold text-slate-600 shadow-sm"
        >
          {step}
        </span>
      </div>

      {/* Text */}
      <div className="max-w-[180px]">
        <h3 className="text-sm font-semibold text-slate-900 mb-1 leading-snug">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// ==========================================
// How It Works Section
// ==========================================
function HowItWorksSection() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="section bg-white"
    >
      <div className="container-app">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary-600">
            How It Works
          </span>
          <h2
            id="how-it-works-heading"
            className="mt-2 text-3xl font-bold text-slate-900 tracking-tight"
          >
            Your affordable healthcare journey in 6 steps
          </h2>
          <p className="mt-3 text-slate-500 text-base leading-relaxed">
            From first search to final saving — the entire process takes minutes.
          </p>
        </div>

        {/* ── Desktop: 6-column horizontal layout ─────────────────────── */}
        <div className="hidden lg:block relative">
          {/* Dashed connector line spanning all 6 step icons */}
          <div
            aria-hidden="true"
            className="absolute top-8 left-[calc(100%/12)] right-[calc(100%/12)] h-px border-t-2 border-dashed border-slate-200"
          />
          <div className="grid grid-cols-6 gap-4">
            {STEPS.map((s) => (
              <StepCard key={s.step} {...s} />
            ))}
          </div>
        </div>

        {/* ── Mobile / tablet: 2-column grid ──────────────────────────── */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-8">
          {STEPS.map((s) => (
            <StepCard key={s.step} {...s} />
          ))}
        </div>

      </div>
    </section>
  )
}

export default HowItWorksSection
