/**
 * Component: BenefitsSection
 *
 * Purpose:
 *   Explains the clinical, financial, and accessibility benefits of
 *   generic medicines to educate visitors and build trust.
 *
 * Responsibilities:
 *   - Display six benefit checklist items
 *   - Render an illustrative price-comparison visual (SVG-free, CSS only)
 *   - Reinforce cost-saving message with a savings badge
 *
 * Dependencies:
 *   - React Icons (hi2)
 *   - Tailwind design system tokens
 */

import { HiOutlineCheckCircle } from 'react-icons/hi2'

const BENEFITS = [
  {
    title: 'Same therapeutic effect',
    description:
      'Generic medicines contain the same active ingredient, strength, and form as the original brand.',
  },
  {
    title: 'Quality assured',
    description:
      'All PMJAP medicines are manufactured by WHO-GMP certified facilities and quality tested.',
  },
  {
    title: 'Significant cost savings',
    description:
      'Generic medicines can cost 50–90% less than branded equivalents, reducing patient burden.',
  },
  {
    title: 'Widely available',
    description:
      'Available at over 10,000 Jan Aushadhi Kendras across all states and union territories of India.',
  },
  {
    title: 'Prescribed by doctors',
    description:
      'Doctors across India are increasingly prescribing generic medicines as per MCI/NMC guidelines.',
  },
  {
    title: 'Supports public health',
    description:
      'Choosing generics promotes a sustainable healthcare ecosystem and reduces out-of-pocket expenses.',
  },
]

// Illustration: comparison bar chart placeholder
function BenefitsIllustration() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-sm mx-auto rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm"
    >
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Price Comparison (illustrative)
      </p>

      {[
        { label: 'Branded Medicine', width: 'w-full', bg: 'bg-slate-300', price: '₹180' },
        { label: 'Jan Aushadhi Generic', width: 'w-2/5', bg: 'bg-primary-500', price: '₹36' },
      ].map(({ label, width, bg, price }) => (
        <div key={label} className="mb-4">
          <div className="flex justify-between text-xs text-slate-600 mb-1">
            <span>{label}</span>
            <span className="font-semibold">{price}</span>
          </div>
          <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
            <div className={`${width} h-full ${bg} rounded-full`} />
          </div>
        </div>
      ))}

      <p className="text-[10px] text-slate-400 mt-2">
        * Prices are illustrative. Actual savings vary by medicine.
      </p>

      {/* Savings badge */}
      <div className="mt-5 flex items-center justify-center gap-2 py-3 rounded-xl bg-success-50 border border-success-200">
        <HiOutlineCheckCircle size={18} className="text-success-600" aria-hidden="true" />
        <span className="text-sm font-semibold text-success-700">Save up to 80% on medicines</span>
      </div>
    </div>
  )
}

function BenefitsSection() {
  return (
    <section
      aria-labelledby="benefits-heading"
      className="section bg-slate-50"
    >
      <div className="container-app">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Content ──────────────────────────────────────────── */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-success-600">
              Generic Medicine Benefits
            </span>
            <h2
              id="benefits-heading"
              className="mt-2 text-3xl font-bold text-slate-900 tracking-tight leading-snug"
            >
              Why choose generic medicines?
            </h2>
            <p className="mt-3 text-slate-500 leading-relaxed mb-6">
              Generic medicines are bioequivalent to their branded counterparts — delivering the same
              clinical outcomes at a significantly lower cost.
            </p>

            <ul className="space-y-3" role="list">
              {BENEFITS.map(({ title, description }) => (
                <li key={title} className="flex items-start gap-3" role="listitem">
                  <HiOutlineCheckCircle
                    size={18}
                    className="text-success-500 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-800">{title} — </span>
                    <span className="text-sm text-slate-500">{description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Visual ───────────────────────────────────────────── */}
          <div>
            <BenefitsIllustration />
          </div>

        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
