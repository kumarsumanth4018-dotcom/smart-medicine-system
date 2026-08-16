/**
 * Component: RecommendationExplanation
 *
 * Description:
 *   Educational section explaining why the generic medicine was
 *   recommended. Uses icon cards for each reason category.
 *
 * Responsibilities:
 *   - Display 6 explanation reason cards
 *   - Composition Match, Savings, Government Generic, Affordable,
 *     Availability, Healthcare Advisory
 *
 * Backend readiness:
 *   - explanation → GET /api/v1/medicines/:id/recommendation-explanation
 */

import {
  HiOutlineCheckCircle, HiOutlineCurrencyRupee,
  HiOutlineShieldCheck, HiOutlineMapPin,
  HiOutlineBuildingLibrary, HiOutlineInformationCircle,
} from 'react-icons/hi2'

const EXPLANATIONS = [
  {
    id: 'composition',
    icon: HiOutlineCheckCircle,
    iconBg: 'bg-success-100',
    iconColor: 'text-success-700',
    title: 'Composition Match',
    description: 'The recommended generic contains the identical active ingredient (Paracetamol IP) at the same strength as the branded medicine.',
  },
  {
    id: 'savings',
    icon: HiOutlineCurrencyRupee,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-700',
    title: 'Estimated Savings',
    description: 'Switching to this Jan Aushadhi alternative can save up to 85% per tablet compared to the branded equivalent.',
  },
  {
    id: 'govt-generic',
    icon: HiOutlineBuildingLibrary,
    iconBg: 'bg-info-100',
    iconColor: 'text-info-700',
    title: 'Government Generic',
    description: 'This medicine is part of the PM Jan Aushadhi Pariyojana (PMJAP), a Government of India initiative for affordable medicines.',
  },
  {
    id: 'affordable',
    icon: HiOutlineCurrencyRupee,
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-700',
    title: 'Affordable Option',
    description: 'At ₹18 per strip, this is one of the most cost-effective options available for this composition in the Jan Aushadhi network.',
  },
  {
    id: 'availability',
    icon: HiOutlineMapPin,
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-700',
    title: 'Nearby Availability',
    description: 'This generic alternative is currently in stock at multiple Jan Aushadhi Kendras near your location.',
  },
  {
    id: 'advisory',
    icon: HiOutlineInformationCircle,
    iconBg: 'bg-danger-50',
    iconColor: 'text-danger-600',
    title: 'Healthcare Advisory',
    description: 'Always consult your doctor or pharmacist before switching medicines. Generic medicines require the same prescription if applicable.',
  },
]

function ExplanationCard({ card }) {
  const Icon = card.icon
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
      <div className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${card.iconBg}`}>
        <Icon size={18} className={card.iconColor} aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">{card.title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{card.description}</p>
      </div>
    </div>
  )
}

// ======================================================
// Recommendation Explanation
// ======================================================
function RecommendationExplanation() {
  return (
    <section aria-labelledby="explanation-heading">

      {/* ======================================================
          Recommendation Explanation
         ====================================================== */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineShieldCheck size={18} className="text-primary-600" aria-hidden="true" />
          <h2 id="explanation-heading" className="text-base font-bold text-slate-900">
            Why this medicine is recommended
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="list">
          {EXPLANATIONS.map((card) => (
            <div key={card.id} role="listitem">
              <ExplanationCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecommendationExplanation
